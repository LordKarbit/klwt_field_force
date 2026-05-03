self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function readPushPayload(event) {
  if (!event.data) return {};
  try {
    return event.data.json();
  } catch {
    return { title: 'Polibeli KLWT', body: event.data.text() };
  }
}

self.addEventListener('push', (event) => {
  const payload = readPushPayload(event);
  const title = payload.title || 'Polibeli KLWT';
  const data = payload.data || {};

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || 'Notifikasi baru tersedia.',
      icon: payload.icon || '/polibeli_logo.png',
      badge: payload.badge || '/polibeli_logo.png',
      tag: payload.tag || data.notificationId || 'klwt-notification',
      data,
      renotify: true,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const sameOriginClient = clients.find((client) => new URL(client.url).origin === self.location.origin);
      if (sameOriginClient) {
        sameOriginClient.postMessage({ type: 'KLWT_NOTIFICATION_CLICK', url: targetUrl });
        return sameOriginClient.focus();
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
