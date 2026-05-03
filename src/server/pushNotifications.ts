import fs from 'node:fs';
import path from 'node:path';
import webPush from 'web-push';

const localVapidPath = path.join('data', 'web-push-vapid.json');

type VapidRuntimeConfig = {
  enabled: boolean;
  publicKey: string;
  privateKey: string;
  subject: string;
  source: 'environment' | 'local-dev' | 'disabled';
  reason: string;
};

export type PushDeliveryPayload = {
  notificationId: string;
  type: string;
  severity: string;
  title: string;
  body: string;
  actionView: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

export type PushSubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

let runtimeConfig: VapidRuntimeConfig | null = null;

function readOrCreateLocalVapidKeys() {
  fs.mkdirSync('data', { recursive: true });

  if (fs.existsSync(localVapidPath)) {
    const parsed = JSON.parse(fs.readFileSync(localVapidPath, 'utf8')) as { publicKey?: string; privateKey?: string };
    if (parsed.publicKey && parsed.privateKey) return parsed as { publicKey: string; privateKey: string };
  }

  const keys = webPush.generateVAPIDKeys();
  fs.writeFileSync(localVapidPath, `${JSON.stringify(keys, null, 2)}\n`);
  return keys;
}

function resolveVapidConfig(): VapidRuntimeConfig {
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY?.trim();
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY?.trim();
  const subject = process.env.WEB_PUSH_SUBJECT?.trim() || 'mailto:admin@polibeli.local';

  if (publicKey && privateKey) {
    return { enabled: true, publicKey, privateKey, subject, source: 'environment', reason: '' };
  }

  if (publicKey || privateKey) {
    return {
      enabled: false,
      publicKey: publicKey ?? '',
      privateKey: privateKey ?? '',
      subject,
      source: 'disabled',
      reason: 'WEB_PUSH_PUBLIC_KEY dan WEB_PUSH_PRIVATE_KEY harus diset berpasangan.',
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    const localKeys = readOrCreateLocalVapidKeys();
    return { enabled: true, publicKey: localKeys.publicKey, privateKey: localKeys.privateKey, subject, source: 'local-dev', reason: '' };
  }

  return {
    enabled: false,
    publicKey: '',
    privateKey: '',
    subject,
    source: 'disabled',
    reason: 'Web Push belum dikonfigurasi. Set WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY, dan WEB_PUSH_SUBJECT.',
  };
}

export function getPushRuntimeConfig() {
  if (!runtimeConfig) {
    runtimeConfig = resolveVapidConfig();
    if (runtimeConfig.enabled) {
      webPush.setVapidDetails(runtimeConfig.subject, runtimeConfig.publicKey, runtimeConfig.privateKey);
    }
  }

  return runtimeConfig;
}

export function getPushPublicStatus() {
  const config = getPushRuntimeConfig();
  return {
    enabled: config.enabled,
    publicKey: config.enabled ? config.publicKey : '',
    source: config.source,
    reason: config.reason,
  };
}

export async function sendPushNotification(subscription: PushSubscriptionRow, payload: PushDeliveryPayload) {
  const config = getPushRuntimeConfig();
  if (!config.enabled) return { skipped: true as const };

  const url = `/?view=${encodeURIComponent(payload.actionView)}&notification=${encodeURIComponent(payload.notificationId)}`;
  await webPush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    },
    JSON.stringify({
      title: payload.title,
      body: payload.body.slice(0, 160),
      tag: `${payload.type}:${payload.entityId}`,
      data: {
        url,
        actionView: payload.actionView,
        entityType: payload.entityType,
        entityId: payload.entityId,
        notificationId: payload.notificationId,
        createdAt: payload.createdAt,
      },
      icon: '/polibeli_logo.png',
      badge: '/polibeli_logo.png',
    }),
    { TTL: 60 * 60 * 6 },
  );

  return { skipped: false as const };
}

export function isExpiredPushSubscriptionError(error: unknown) {
  return typeof error === 'object' && error !== null && 'statusCode' in error && [404, 410].includes(Number(error.statusCode));
}
