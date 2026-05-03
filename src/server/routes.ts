import type { Request, Response, Router } from 'express';
import { inflateRawSync } from 'node:zlib';
import { and, asc, desc, eq, gte, inArray, isNull, lt, lte, ne, type SQL } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { auth } from './auth';
import { db, rawDb, schema } from './db';
import { getPushPublicStatus, isExpiredPushSubscriptionError, sendPushNotification } from './pushNotifications';
import {
  boundaryDataStatus,
  listLocationCities,
  listLocationDistricts,
  listLocationProvinces,
  listLocationVillages,
  locationExists,
  locationMasterCount,
  reverseLocation,
} from './locationBoundaries';
import { canMergeDuplicateTarget, duplicateVerificationNote } from './verificationRules';
import { DUPLICATE_WARNING_THRESHOLD, normalizeStoreMatch, topDuplicateCandidates } from '../verificationLogic';

const roleSchema = z.enum(['Head', 'Manager', 'Surveyor', 'Verificator', 'Administrator']);
const statusSchema = z.enum(['Active', 'Inactive']);
const verificationDecisionSchema = z.enum(['VERIFIED_VALID', 'NEED_REVISION', 'REJECTED_INVALID', 'MERGED_DUPLICATE']);
const analyticsCacheTtlMs = 10_000;
const analyticsResponseCache = new Map<string, { expiresAt: number; payload: unknown }>();

const userInputSchema = z.object({
  name: z.string().trim().min(1),
  username: z.string().trim().min(1),
  password: z.string().min(4).optional(),
  phone: z.string().trim().min(1),
  role: roleSchema,
  managerId: z.string().optional().nullable(),
  area: z.string().optional(),
  status: statusSchema.optional(),
});

const locationQuerySchema = z.object({
  province: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

const reverseLocationQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  accuracy: z.coerce.number().min(0).max(10_000).optional(),
});

const assignmentListQuerySchema = z.object({
  visitDate: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(5000).default(5000),
});

const locationValidationSchema = z.object({
  province: z.string().trim().min(1),
  city: z.string().trim().min(1),
  district: z.string().trim().min(1),
  village: z.string().trim().min(1),
});

const surveyInputSchema = z.object({
  assignmentId: z.string().trim().optional().nullable(),
  storeName: z.string().trim().min(1),
  storeAlias: z.string().trim().optional().nullable(),
  visitOutcome: z.string().trim().min(1),
  plannedOrUnplanned: z.enum(['PLANNED', 'UNPLANNED']),
  province: z.string().trim().min(1),
  city: z.string().trim().min(1),
  district: z.string().trim().min(1),
  village: z.string().trim().min(1),
  addressDetail: z.string().trim().min(1),
  landmark: z.string().trim().min(1),
  latitude: z.string().trim().min(1),
  longitude: z.string().trim().min(1),
  gpsAccuracy: z.number().int().nonnegative(),
  gpsWarningFlag: z.boolean(),
  gpsDistanceFromTarget: z.number().int().nonnegative(),
  contactPersonName: z.string().trim().optional().nullable(),
  picType: z.string().trim().min(1),
  whatsappNumber: z.string().trim().optional().nullable(),
  waEmptyReason: z.string().trim().optional().nullable(),
  purchasingDecisionMaker: z.string().trim().min(1),
  decisionMakerAvailability: z.string().trim().min(1),
  businessType: z.string().trim().min(1),
  vehicleSpecialization: z.array(z.string().trim().min(1)).min(1),
  storeScale: z.string().trim().min(1),
  coolingProducts: z.array(z.string().trim().min(1)).min(1),
  coolingShelfSize: z.string().trim().min(1),
  coolingSalesActivity: z.string().trim().min(1),
  coolingBrands: z.array(z.string().trim().min(1)).min(1),
  productSellingSegment: z.string().trim().min(1),
  lowCostImportShare: z.string().trim().min(1),
  supplierType: z.array(z.string().trim().min(1)).min(1),
  supplierName: z.string().trim().optional().nullable(),
  supplierDependency: z.string().trim().min(1),
  supplierSatisfaction: z.string().trim().min(1),
  returnEase: z.string().trim().min(1),
  deliverySpeed: z.string().trim().min(1),
  paymentMethod: z.string().trim().min(1),
  restockFrequency: z.string().trim().min(1),
  purchaseSizeRange: z.string().trim().min(1),
  monthlyPurchaseValue: z.string().trim().min(1),
  marginExpectation: z.string().trim().min(1),
  currentOrderMethod: z.array(z.string().trim().min(1)).min(1),
  mainPurchaseDriver: z.array(z.string().trim().min(1)).min(1),
  priceSensitivity: z.string().trim().min(1),
  opennessToNewSupplier: z.string().trim().min(1),
  reasonToTryNewSupplier: z.array(z.string().trim().min(1)).min(1),
  willingnessToReceiveFollowUp: z.string().trim().min(1),
  storefrontPhotoUrl: z.string().trim().optional().nullable(),
  interiorPhotoUrl: z.string().trim().optional().nullable(),
  picPhotoUrl: z.string().trim().optional().nullable(),
  photoMissingReason: z.string().trim().optional().nullable(),
  surveyorNotes: z.string().trim().optional().nullable(),
});

const assignmentInputSchema = z.object({
  storeName: z.string().trim().min(1),
  province: z.string().trim().min(1),
  city: z.string().trim().min(1),
  district: z.string().trim().min(1),
  village: z.string().trim().min(1),
  addressDetail: z.string().trim().min(1),
  landmark: z.string().trim().min(1),
  latitude: z.string().trim().optional().nullable(),
  longitude: z.string().trim().optional().nullable(),
  assignedSurveyorId: z.string().trim().min(1),
  visitDate: z.string().trim().min(1),
  priority: z.enum(['High', 'Medium', 'Low']),
  visitObjective: z.string().trim().min(1),
  status: z.string().trim().optional(),
  notes: z.string().trim().optional().nullable(),
});

const reassignmentInputSchema = z.object({
  assignedSurveyorId: z.string().trim().min(1),
  province: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  district: z.string().trim().min(1).optional(),
  village: z.string().trim().min(1).optional(),
  addressDetail: z.string().trim().min(1).optional(),
  landmark: z.string().trim().min(1).optional(),
  latitude: z.string().trim().optional().nullable(),
  longitude: z.string().trim().optional().nullable(),
  visitDate: z.string().trim().min(1).optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
  visitObjective: z.string().trim().optional(),
  status: z.string().trim().optional(),
  notes: z.string().trim().optional().nullable(),
});

const evidenceInputSchema = z.object({
  photoType: z.string().trim().min(1),
  dataUrl: z.string().startsWith('data:image/'),
});

const maxXlsxBase64Length = 8_000_000;
const maxXlsxEntries = 80;
const maxXlsxEntryBytes = 6_000_000;
const maxXlsxTotalBytes = 12_000_000;
const maxXlsxRows = 5_000;

const importInputSchema = z.object({
  fileName: z.string().trim().toLowerCase().endsWith('.xlsx'),
  dataBase64: z.string().trim().min(1).max(maxXlsxBase64Length),
});

const importTemplateHeaders = {
  'user-import': ['name', 'username', 'password', 'phone', 'role', 'manager_username', 'area', 'status'],
  'target-store-import': ['store_name', 'province', 'city_regency', 'district', 'village', 'address_detail', 'landmark', 'latitude', 'longitude', 'assigned_manager', 'assigned_surveyor', 'visit_date', 'priority', 'notes'],
  'master-survey-options': ['question_code', 'question_label', 'option_value', 'option_label', 'sort_order', 'is_active'],
  'territory-master': ['province', 'city', 'district', 'village', 'manager_username', 'surveyor_username', 'is_active'],
} as const;

const verificationInputSchema = z.object({
  status: verificationDecisionSchema,
  verificationNotes: z.string().trim().optional().nullable(),
  revisionRequest: z.string().trim().optional().nullable(),
  duplicateTargetId: z.string().trim().optional().nullable(),
  duplicateTargetStoreName: z.string().trim().optional().nullable(),
  verifierPhoneCallable: z.boolean().optional().nullable(),
  verifierWhatsappReachable: z.boolean().optional().nullable(),
});
const verificationAnnulInputSchema = z.object({
  reason: z.string().trim().max(500).optional().nullable(),
});

const surveyListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(250),
  cursor: z.string().trim().optional(),
});
const dashboardMetricSchema = z.enum(['submitted', 'verified', 'hot', 'warnings']);
const dashboardTimeSeriesModeSchema = z.enum(['runRate', 'target']);
const dashboardTimeSeriesQuerySchema = z.object({
  mode: dashboardTimeSeriesModeSchema.default('runRate'),
  surveyorId: z.string().trim().optional().default('all'),
});
const dashboardMetricStoresQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(250),
});
const verificationMetricSchema = z.enum(['pending', 'surveyors', 'warning', 'gps', 'missingPhoto', 'duplicate']);
const verificationMetricStoresQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(250),
});
const notificationListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  unreadOnly: z.preprocess((value) => value === true || value === 'true', z.boolean()).default(false),
});
const pushSubscriptionInputSchema = z.object({
  endpoint: z.string().trim().url().max(4096),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().trim().min(1).max(1024),
    auth: z.string().trim().min(1).max(1024),
  }),
  userAgent: z.string().trim().max(512).optional(),
});
const pushSubscriptionDeleteSchema = z.object({
  endpoint: z.string().trim().url().max(4096),
});
const pushStatusQuerySchema = z.object({
  endpoint: z.string().trim().url().max(4096).optional(),
});
const duplicateCandidateQuerySchema = z.object({
  search: z.string().trim().optional().default(''),
  limit: z.coerce.number().int().min(1).max(25).default(10),
  minScore: z.coerce.number().int().min(0).max(100).default(25),
});

function emailForUsername(username: string) {
  return `${username.toLowerCase()}@polibeli.local`;
}

function sanitizeUser(profile: typeof schema.userProfile.$inferSelect, authUser: typeof schema.user.$inferSelect) {
  return {
    id: profile.id,
    authUserId: profile.authUserId,
    name: authUser.name,
    username: profile.username,
    phone: profile.phone,
    role: profile.role,
    managerId: profile.managerId ?? '',
    area: profile.area,
    status: profile.status,
    email: authUser.email,
  };
}

async function getSessionFromRequest(req: Request) {
  const response = await auth.handler(
    new Request('http://127.0.0.1:3005/api/auth/get-session', {
      method: 'GET',
      headers: {
        cookie: req.headers.cookie ?? '',
      },
    }),
  );

  if (!response.ok) return null;
  const session = await response.json();
  if (!session?.user?.id) return null;

  const profile = await db.query.userProfile.findFirst({
    where: eq(schema.userProfile.authUserId, session.user.id),
  });

  if (!profile || profile.status !== 'Active') return null;

  return {
    ...session,
    profile,
    user: sanitizeUser(profile, session.user),
  };
}

async function requireSession(req: Request, res: Response) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return session;
}

async function requireAdmin(req: Request, res: Response) {
  const session = await requireSession(req, res);
  if (!session) return null;
  if (session.profile.role !== 'Administrator') {
    res.status(403).json({ error: 'Administrator access required' });
    return null;
  }
  return session;
}

async function requireVerificationAccess(req: Request, res: Response) {
  const session = await requireSession(req, res);
  if (!session) return null;
  if (!['Verificator', 'Administrator'].includes(session.profile.role)) {
    res.status(403).json({ error: 'Verificator access required' });
    return null;
  }
  return session;
}

async function requireRole(req: Request, res: Response, allowedRoles: Array<z.infer<typeof roleSchema>>) {
  const session = await requireSession(req, res);
  if (!session) return null;
  if (!allowedRoles.includes(session.profile.role as z.infer<typeof roleSchema>)) {
    res.status(403).json({ error: `${allowedRoles.join('/')} access required` });
    return null;
  }
  return session;
}

function copyBetterAuthResponse(response: globalThis.Response, res: Response, payload?: unknown) {
  const setCookies = response.headers.getSetCookie?.() ?? [];
  if (setCookies.length) res.setHeader('set-cookie', setCookies);
  const fallbackCookie = response.headers.get('set-cookie');
  if (!setCookies.length && fallbackCookie) res.setHeader('set-cookie', fallbackCookie);

  res.status(response.status);
  return payload === undefined ? response.text().then((text) => res.send(text)) : res.json(payload);
}

async function signUpAuthUser(input: { name: string; username: string; password: string }) {
  const response = await auth.handler(
    new Request('http://127.0.0.1:3005/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        email: emailForUsername(input.username),
        password: input.password,
      }),
    }),
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to create auth user');
  }

  return db.query.user.findFirst({
    where: eq(schema.user.email, emailForUsername(input.username)),
  });
}

function json(value: unknown) {
  return JSON.stringify(value);
}

function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseJsonArrayOrText(value: string | null) {
  if (!value) return [];
  const parsed = parseJsonArray(value);
  return parsed.length ? parsed : [value];
}

function parseJsonObject(value: string | null) {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function toIsoString(value: Date | number | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function gradeMerchant(score: number) {
  if (score >= 85) return 'A+';
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

function gradeQuality(score: number) {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Warning';
  return 'Poor';
}

function isCompletedVisitOutcome(value: string) {
  return value === 'Survey Completed' || value === 'SURVEY_COMPLETED';
}

type DuplicateMeta = {
  duplicateCandidateCount: number;
  duplicateTopScore: number;
};

const emptyDuplicateMeta: DuplicateMeta = {
  duplicateCandidateCount: 0,
  duplicateTopScore: 0,
};

function duplicateAwareWarningFlags(row: typeof schema.surveyResult.$inferSelect, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  const nonDuplicateFlags = parseJsonArray(row.warningFlags).filter((flag) => !flag.includes('DUPLICATE'));
  return duplicateMeta.duplicateCandidateCount > 0 ? [...nonDuplicateFlags, 'POSSIBLE_DUPLICATE'] : nonDuplicateFlags;
}

function scoreSurvey(input: z.infer<typeof surveyInputSchema>, warningFlags: string[]) {
  if (!isCompletedVisitOutcome(input.visitOutcome)) {
    let dataQualityScore = 88;
    dataQualityScore -= warningFlags.includes('GPS_WARNING_GT_100M') ? 14 : 0;
    dataQualityScore -= warningFlags.includes('VERIFIER_WA_UNREACHABLE') ? 8 : 0;
    dataQualityScore -= warningFlags.includes('VERIFIER_PHONE_UNREACHABLE') ? 5 : 0;
    dataQualityScore -= input.surveyorNotes ? 0 : 10;
    dataQualityScore = Math.max(50, Math.min(100, Math.round(dataQualityScore)));

    return {
      merchantPotentialScore: 0,
      merchantGrade: gradeMerchant(0),
      dataQualityScore,
      dataQualityGrade: gradeQuality(dataQualityScore),
      leadClassification: 'Visit Not Completed',
    };
  }

  const coolingProducts = input.coolingProducts.filter((item) => !item.includes('Tidak terlihat'));
  let merchantScore = 18;

  merchantScore += input.businessType.includes('Cooling') || input.businessType.includes('Radiator') ? 18 : 0;
  merchantScore += input.businessType.includes('AC') ? 14 : 0;
  merchantScore += input.businessType.includes('General') || input.businessType.includes('Wholesale') ? 10 : 0;
  merchantScore += input.businessType.includes('Workshop') ? 7 : 0;
  merchantScore += Math.min(coolingProducts.length * 3, 18);
  merchantScore += input.coolingShelfSize.includes('Banyak') ? 10 : input.coolingShelfSize === 'Sedang' ? 7 : input.coolingShelfSize === 'Sedikit' ? 3 : 0;
  merchantScore += input.coolingSalesActivity === 'Sangat rutin' ? 12 : input.coolingSalesActivity === 'Cukup rutin' ? 9 : input.coolingSalesActivity === 'Kadang' ? 4 : 0;
  merchantScore += input.lowCostImportShare === 'Dominan' ? 9 : input.lowCostImportShare === 'Campuran' ? 7 : input.lowCostImportShare === 'Sedikit' ? 3 : 0;
  merchantScore += input.productSellingSegment.includes('Economy') ? 5 : input.productSellingSegment.includes('Mid') ? 3 : 0;
  merchantScore += input.supplierSatisfaction === 'Sedang cari alternatif' ? 11 : input.supplierSatisfaction === 'Banyak keluhan' ? 8 : input.supplierSatisfaction === 'Cukup puas' ? 2 : 0;
  merchantScore += input.returnEase.includes('Sulit') ? 4 : 0;
  merchantScore += input.deliverySpeed.includes('lama') || input.deliverySpeed.includes('inden') ? 4 : 0;
  merchantScore += input.restockFrequency === 'Hampir tiap hari' ? 8 : input.restockFrequency === 'Mingguan' ? 6 : input.restockFrequency === 'Bulanan' ? 3 : 0;
  merchantScore += input.purchaseSizeRange === 'Besar' || input.monthlyPurchaseValue.includes('25') ? 6 : input.purchaseSizeRange === 'Sedang' ? 3 : 0;
  merchantScore += input.opennessToNewSupplier === 'Sangat terbuka' ? 13 : input.opennessToNewSupplier === 'Bisa coba' ? 9 : input.opennessToNewSupplier === 'Hanya merk tertentu' ? 2 : -6;
  merchantScore += input.mainPurchaseDriver.some((item) => ['Harga murah', 'Margin besar', 'Barang lengkap', 'Fast delivery'].includes(item)) ? 4 : 0;
  merchantScore += input.whatsappNumber ? 5 : 0;
  merchantScore += ['Selalu ada', 'By phone/WA'].includes(input.decisionMakerAvailability) ? 4 : 0;

  merchantScore = Math.max(0, Math.min(100, Math.round(merchantScore)));
  const merchantGrade = gradeMerchant(merchantScore);
  const isOpen = ['Sangat terbuka', 'Bisa coba'].includes(input.opennessToNewSupplier);
  const highCooling = coolingProducts.length >= 4 && ['Cukup rutin', 'Sangat rutin'].includes(input.coolingSalesActivity);
  const leadClassification =
    ['A', 'A+'].includes(merchantGrade) && isOpen && input.whatsappNumber
      ? 'Hot Lead'
      : ['A', 'A+'].includes(merchantGrade) && isOpen
        ? 'Qualified Lead'
        : highCooling && !isOpen
          ? 'Strategic Lead'
          : merchantGrade === 'B'
            ? 'Normal Lead'
            : 'Low Priority';

  const unknownAnswers = [
    input.returnEase,
    input.deliverySpeed,
    input.restockFrequency,
    input.purchaseSizeRange,
    input.monthlyPurchaseValue,
    input.paymentMethod,
  ].filter((item) => item.includes('Tidak tahu') || item.includes('Tidak bersedia')).length;

  let dataQualityScore = 100;
  dataQualityScore -= warningFlags.includes('GPS_WARNING_GT_100M') ? 14 : 0;
  dataQualityScore -= warningFlags.includes('WA_EMPTY_WITH_REASON') ? 8 : 0;
  dataQualityScore -= warningFlags.includes('VERIFIER_WA_UNREACHABLE') ? 8 : 0;
  dataQualityScore -= warningFlags.includes('VERIFIER_PHONE_UNREACHABLE') ? 5 : 0;
  dataQualityScore -= warningFlags.includes('MISSING_INTERIOR_PHOTO') ? 10 : 0;
  dataQualityScore -= warningFlags.includes('MISSING_PIC_PHOTO') ? 8 : 0;
  dataQualityScore -= input.supplierName ? 0 : 6;
  dataQualityScore -= input.contactPersonName ? 0 : 5;
  dataQualityScore -= unknownAnswers >= 2 ? 7 : 0;
  dataQualityScore = Math.max(25, Math.min(100, Math.round(dataQualityScore)));

  return {
    merchantPotentialScore: merchantScore,
    merchantGrade,
    dataQualityScore,
    dataQualityGrade: gradeQuality(dataQualityScore),
    leadClassification,
  };
}

function effectiveVerifierWhatsappReachable(
  row: Pick<typeof schema.surveyResult.$inferSelect, 'whatsappNumber' | 'verifierWhatsappReachable'>,
  override?: boolean | null,
) {
  if (!row.whatsappNumber) return false;
  if (override !== undefined && override !== null) return override;
  if (row.verifierWhatsappReachable !== null && row.verifierWhatsappReachable !== undefined) return row.verifierWhatsappReachable;
  return true;
}

function effectiveVerifierPhoneCallable(
  row: Pick<typeof schema.surveyResult.$inferSelect, 'whatsappNumber' | 'decisionMakerAvailability' | 'verifierPhoneCallable'>,
  override?: boolean | null,
) {
  if (!row.whatsappNumber) return false;
  if (override !== undefined && override !== null) return override;
  if (row.verifierPhoneCallable !== null && row.verifierPhoneCallable !== undefined) return row.verifierPhoneCallable;
  return ['Selalu ada', 'By phone/WA', 'Ditemui langsung'].includes(row.decisionMakerAvailability);
}

function effectiveLeadClassification(row: typeof schema.surveyResult.$inferSelect) {
  if (row.leadClassification === 'Hot Lead' && !effectiveVerifierWhatsappReachable(row)) return 'Qualified Lead';
  return row.leadClassification;
}

function contactAdjustedWarningFlags(row: typeof schema.surveyResult.$inferSelect, phoneCallable: boolean, whatsappReachable: boolean) {
  const baseFlags = parseJsonArray(row.warningFlags).filter((flag) => !flag.startsWith('VERIFIER_'));
  const flags = row.whatsappNumber && whatsappReachable ? baseFlags.filter((flag) => flag !== 'WA_EMPTY_WITH_REASON') : baseFlags;
  if (row.whatsappNumber && !whatsappReachable) flags.push('VERIFIER_WA_UNREACHABLE');
  if (row.whatsappNumber && !phoneCallable) flags.push('VERIFIER_PHONE_UNREACHABLE');
  return Array.from(new Set(flags));
}

function surveyScoreInputFromRow(
  row: typeof schema.surveyResult.$inferSelect,
  phoneCallable: boolean,
  whatsappReachable: boolean,
): z.infer<typeof surveyInputSchema> {
  const reachableDecisionMaker =
    phoneCallable || whatsappReachable
      ? ['Selalu ada', 'By phone/WA', 'Ditemui langsung'].includes(row.decisionMakerAvailability)
        ? row.decisionMakerAvailability
        : 'By phone/WA'
      : row.decisionMakerAvailability;

  return {
    assignmentId: row.assignmentId ?? undefined,
    storeName: row.storeName,
    storeAlias: row.storeAlias ?? undefined,
    visitOutcome: row.visitOutcome,
    plannedOrUnplanned: row.plannedOrUnplanned as 'PLANNED' | 'UNPLANNED',
    province: row.province,
    city: row.city,
    district: row.district,
    village: row.village,
    addressDetail: row.addressDetail,
    landmark: row.landmark,
    latitude: row.latitude,
    longitude: row.longitude,
    gpsAccuracy: row.gpsAccuracy,
    gpsWarningFlag: row.gpsWarningFlag,
    gpsDistanceFromTarget: row.gpsDistanceFromTarget,
    contactPersonName: row.contactPersonName,
    picType: row.picType,
    whatsappNumber: whatsappReachable ? row.whatsappNumber : null,
    waEmptyReason: whatsappReachable ? null : row.waEmptyReason,
    purchasingDecisionMaker: row.purchasingDecisionMaker,
    decisionMakerAvailability: reachableDecisionMaker,
    businessType: row.businessType,
    vehicleSpecialization: parseJsonArrayOrText(row.vehicleSpecialization),
    storeScale: row.storeScale,
    coolingProducts: parseJsonArrayOrText(row.coolingProducts),
    coolingShelfSize: row.coolingShelfSize,
    coolingSalesActivity: row.coolingSalesActivity,
    coolingBrands: parseJsonArrayOrText(row.coolingBrands),
    productSellingSegment: row.productSellingSegment,
    lowCostImportShare: row.lowCostImportShare,
    supplierType: parseJsonArrayOrText(row.supplierType),
    supplierName: row.supplierName,
    supplierDependency: row.supplierDependency,
    supplierSatisfaction: row.supplierSatisfaction,
    returnEase: row.returnEase,
    deliverySpeed: row.deliverySpeed,
    paymentMethod: row.paymentMethod,
    restockFrequency: row.restockFrequency,
    purchaseSizeRange: row.purchaseSizeRange,
    monthlyPurchaseValue: row.monthlyPurchaseValue,
    marginExpectation: row.marginExpectation,
    currentOrderMethod: parseJsonArrayOrText(row.currentOrderMethod),
    mainPurchaseDriver: parseJsonArrayOrText(row.mainPurchaseDriver),
    priceSensitivity: row.priceSensitivity,
    opennessToNewSupplier: row.opennessToNewSupplier,
    reasonToTryNewSupplier: parseJsonArrayOrText(row.reasonToTryNewSupplier),
    willingnessToReceiveFollowUp: row.willingnessToReceiveFollowUp,
    storefrontPhotoUrl: row.storefrontPhotoUrl,
    interiorPhotoUrl: row.interiorPhotoUrl,
    picPhotoUrl: row.picPhotoUrl,
    photoMissingReason: row.photoMissingReason,
    surveyorNotes: row.surveyorNotes,
  };
}

function scoreSurveyWithVerifierContact(
  row: typeof schema.surveyResult.$inferSelect,
  overrides: { verifierPhoneCallable?: boolean | null; verifierWhatsappReachable?: boolean | null },
) {
  const phoneCallable = effectiveVerifierPhoneCallable(row, overrides.verifierPhoneCallable);
  const whatsappReachable = effectiveVerifierWhatsappReachable(row, overrides.verifierWhatsappReachable);
  const warningFlags = contactAdjustedWarningFlags(row, phoneCallable, whatsappReachable);
  const scoreInput = surveyScoreInputFromRow(row, phoneCallable, whatsappReachable);
  return {
    phoneCallable,
    whatsappReachable,
    warningFlags,
    score: scoreSurvey(scoreInput, warningFlags),
  };
}

function sanitizeSurvey(row: typeof schema.surveyResult.$inferSelect, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  return {
    id: row.id,
    assignmentId: row.assignmentId ?? '',
    storeCode: row.storeCode,
    storeName: row.storeName,
    storeAlias: row.storeAlias ?? '',
    merchantPotentialScore: row.merchantPotentialScore,
    merchantGrade: row.merchantGrade,
    dataQualityScore: row.dataQualityScore,
    dataQualityGrade: row.dataQualityGrade,
    leadClassification: effectiveLeadClassification(row),
    warningFlags: duplicateAwareWarningFlags(row, duplicateMeta),
    verificationStatus: row.verificationStatus,
    duplicateCandidateCount: duplicateMeta.duplicateCandidateCount,
    duplicateTopScore: duplicateMeta.duplicateTopScore,
    verificatorId: row.verificatorId ?? '',
    verificationNotes: row.verificationNotes ?? '',
    revisionRequest: row.revisionRequest ?? '',
    verifiedAt: row.verifiedAt ? toIsoString(row.verifiedAt) : '',
    verifierPhoneCallable: row.verifierPhoneCallable ?? null,
    verifierWhatsappReachable: row.verifierWhatsappReachable ?? null,
    verifierContactCheckedAt: row.verifierContactCheckedAt ? toIsoString(row.verifierContactCheckedAt) : '',
    surveyorId: row.surveyorId,
    surveyorName: row.surveyorName,
    managerName: row.managerName,
    province: row.province,
    city: row.city,
    district: row.district,
    village: row.village,
    addressDetail: row.addressDetail,
    landmark: row.landmark,
    latitude: row.latitude,
    longitude: row.longitude,
    gpsAccuracy: row.gpsAccuracy,
    gpsWarningFlag: row.gpsWarningFlag,
    gpsDistanceFromTarget: row.gpsDistanceFromTarget,
    visitOutcome: row.visitOutcome,
    plannedOrUnplanned: row.plannedOrUnplanned,
    contactPersonName: row.contactPersonName,
    picType: row.picType,
    whatsappNumber: row.whatsappNumber ?? '',
    waEmptyReason: row.waEmptyReason ?? '',
    purchasingDecisionMaker: row.purchasingDecisionMaker,
    decisionMakerAvailability: row.decisionMakerAvailability,
    businessType: row.businessType,
    vehicleSpecialization: parseJsonArrayOrText(row.vehicleSpecialization),
    storeScale: row.storeScale,
    coolingProducts: parseJsonArrayOrText(row.coolingProducts),
    coolingShelfSize: row.coolingShelfSize,
    coolingSalesActivity: row.coolingSalesActivity,
    coolingBrands: parseJsonArrayOrText(row.coolingBrands),
    productSellingSegment: row.productSellingSegment,
    lowCostImportShare: row.lowCostImportShare,
    supplierType: parseJsonArrayOrText(row.supplierType),
    supplierName: row.supplierName,
    supplierDependency: row.supplierDependency,
    supplierSatisfaction: row.supplierSatisfaction,
    returnEase: row.returnEase,
    deliverySpeed: row.deliverySpeed,
    paymentMethod: row.paymentMethod,
    restockFrequency: row.restockFrequency,
    purchaseSizeRange: row.purchaseSizeRange,
    monthlyPurchaseValue: row.monthlyPurchaseValue,
    marginExpectation: row.marginExpectation,
    currentOrderMethod: parseJsonArrayOrText(row.currentOrderMethod),
    mainPurchaseDriver: parseJsonArrayOrText(row.mainPurchaseDriver),
    priceSensitivity: row.priceSensitivity,
    opennessToNewSupplier: row.opennessToNewSupplier,
    reasonToTryNewSupplier: parseJsonArrayOrText(row.reasonToTryNewSupplier),
    willingnessToReceiveFollowUp: row.willingnessToReceiveFollowUp,
    storefrontPhotoUrl: row.storefrontPhotoUrl,
    interiorPhotoUrl: row.interiorPhotoUrl,
    picPhotoUrl: row.picPhotoUrl,
    photoMissingReason: row.photoMissingReason ?? '',
    surveyorNotes: row.surveyorNotes,
    candidateStoreStatus: row.candidateStoreStatus,
    submitTime: toIsoString(row.submitTime),
    updatedAt: toIsoString(row.updatedAt),
  };
}

function sanitizeSurveyListItem(row: typeof schema.surveyResult.$inferSelect, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  return {
    id: row.id,
    assignmentId: row.assignmentId ?? '',
    storeCode: row.storeCode,
    storeName: row.storeName,
    storeAlias: row.storeAlias ?? '',
    merchantPotentialScore: row.merchantPotentialScore,
    merchantGrade: row.merchantGrade,
    dataQualityScore: row.dataQualityScore,
    dataQualityGrade: row.dataQualityGrade,
    leadClassification: effectiveLeadClassification(row),
    warningFlags: duplicateAwareWarningFlags(row, duplicateMeta),
    verificationStatus: row.verificationStatus,
    duplicateCandidateCount: duplicateMeta.duplicateCandidateCount,
    duplicateTopScore: duplicateMeta.duplicateTopScore,
    verificatorId: row.verificatorId ?? '',
    verificationNotes: row.verificationNotes ?? '',
    revisionRequest: row.revisionRequest ?? '',
    verifiedAt: row.verifiedAt ? toIsoString(row.verifiedAt) : '',
    verifierPhoneCallable: row.verifierPhoneCallable ?? null,
    verifierWhatsappReachable: row.verifierWhatsappReachable ?? null,
    verifierContactCheckedAt: row.verifierContactCheckedAt ? toIsoString(row.verifierContactCheckedAt) : '',
    surveyorId: row.surveyorId,
    surveyorName: row.surveyorName,
    managerName: row.managerName,
    province: row.province,
    city: row.city,
    district: row.district,
    village: row.village,
    addressDetail: row.addressDetail,
    landmark: row.landmark,
    latitude: row.latitude,
    longitude: row.longitude,
    gpsAccuracy: row.gpsAccuracy,
    gpsWarningFlag: row.gpsWarningFlag,
    gpsDistanceFromTarget: row.gpsDistanceFromTarget,
    visitOutcome: row.visitOutcome,
    plannedOrUnplanned: row.plannedOrUnplanned,
    contactPersonName: row.contactPersonName,
    picType: row.picType,
    whatsappNumber: row.whatsappNumber ?? '',
    waEmptyReason: row.waEmptyReason ?? '',
    businessType: row.businessType,
    coolingProducts: parseJsonArrayOrText(row.coolingProducts),
    supplierType: parseJsonArrayOrText(row.supplierType),
    supplierName: row.supplierName,
    storefrontPhotoUrl: row.storefrontPhotoUrl,
    interiorPhotoUrl: row.interiorPhotoUrl,
    picPhotoUrl: row.picPhotoUrl,
    photoMissingReason: row.photoMissingReason ?? '',
    candidateStoreStatus: row.candidateStoreStatus,
    submitTime: toIsoString(row.submitTime),
    updatedAt: toIsoString(row.updatedAt),
    purchasingDecisionMaker: '',
    decisionMakerAvailability: '',
    vehicleSpecialization: [],
    storeScale: '',
    coolingShelfSize: '',
    coolingSalesActivity: '',
    coolingBrands: [],
    productSellingSegment: '',
    lowCostImportShare: '',
    supplierDependency: '',
    supplierSatisfaction: '',
    returnEase: '',
    deliverySpeed: '',
    paymentMethod: '',
    restockFrequency: '',
    purchaseSizeRange: '',
    monthlyPurchaseValue: '',
    marginExpectation: '',
    currentOrderMethod: [],
    mainPurchaseDriver: [],
    priceSensitivity: '',
    opennessToNewSupplier: '',
    reasonToTryNewSupplier: [],
    willingnessToReceiveFollowUp: '',
    surveyorNotes: '',
  };
}

function sanitizeAssignment(row: typeof schema.assignment.$inferSelect) {
  return {
    id: row.id,
    storeName: row.storeName,
    province: row.province,
    city: row.city,
    district: row.district,
    village: row.village,
    addressDetail: row.addressDetail,
    landmark: row.landmark,
    latitude: row.latitude ?? '',
    longitude: row.longitude ?? '',
    assignedManagerId: row.assignedManagerId,
    assignedManagerName: row.assignedManagerName,
    assignedSurveyorId: row.assignedSurveyorId,
    assignedSurveyorName: row.assignedSurveyorName,
    visitDate: toIsoString(row.visitDate),
    priority: row.priority,
    visitObjective: row.visitObjective,
    plannedOrUnplanned: row.plannedOrUnplanned,
    status: row.status,
    notes: row.notes ?? '',
  };
}

type ActiveSession = NonNullable<Awaited<ReturnType<typeof requireSession>>>;

function evidenceIdFromUrl(url: string | null | undefined) {
  const match = (url ?? '').match(/^\/api\/evidence\/([A-Za-z0-9_-]+)$/);
  return match?.[1] ?? null;
}

function surveyReferencesEvidence(row: typeof schema.surveyResult.$inferSelect, evidenceId: string) {
  return [row.storefrontPhotoUrl, row.interiorPhotoUrl, row.picPhotoUrl].some((url) => evidenceIdFromUrl(url) === evidenceId);
}

async function validateEvidenceUrlsForSubmit(session: ActiveSession, urls: Array<string | null | undefined>) {
  const evidenceIds = Array.from(new Set(urls.map(evidenceIdFromUrl).filter(Boolean) as string[]));
  for (const evidenceId of evidenceIds) {
    const evidence = await db.query.photoEvidence.findFirst({ where: eq(schema.photoEvidence.id, evidenceId) });
    if (!evidence) return { status: 400, error: 'Evidence photo was not found' };
    if (session.profile.role !== 'Administrator' && evidence.uploadedBy !== session.profile.id) {
      return { status: 403, error: 'Evidence photo belongs to another user' };
    }
  }
  return null;
}

async function linkSurveyEvidence(surveyId: string, urls: Array<string | null | undefined>) {
  const evidenceIds = Array.from(new Set(urls.map(evidenceIdFromUrl).filter(Boolean) as string[]));
  for (const evidenceId of evidenceIds) {
    await db.update(schema.photoEvidence).set({ surveyId }).where(eq(schema.photoEvidence.id, evidenceId));
  }
}

function canReadEvidence(
  session: ActiveSession,
  evidence: typeof schema.photoEvidence.$inferSelect,
  survey: typeof schema.surveyResult.$inferSelect | undefined,
) {
  if (['Administrator', 'Verificator', 'Head'].includes(session.profile.role)) return true;
  if (evidence.uploadedBy === session.profile.id) return true;
  if (!survey || !surveyReferencesEvidence(survey, evidence.id)) return false;
  if (session.profile.role === 'Surveyor') return survey.surveyorId === session.profile.id;
  if (session.profile.role === 'Manager') return survey.managerId === session.profile.id;
  return false;
}

function effectiveExportScope(profile: typeof schema.userProfile.$inferSelect) {
  if (profile.role === 'Manager') return `Area ${profile.area || profile.username}`;
  if (profile.role === 'Surveyor') return `Surveyor ${profile.username}`;
  if (profile.role === 'Verificator') return 'Verification queue';
  return 'National';
}

function analyticsCacheKey(profile: typeof schema.userProfile.$inferSelect) {
  return `${profile.role}:${profile.id}`;
}

function clearAnalyticsCache() {
  analyticsResponseCache.clear();
}

function sanitizeExportJob(row: typeof schema.exportJob.$inferSelect, rowCount: number, profile: typeof schema.userProfile.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    scope: effectiveExportScope(profile),
    status: row.status,
    ownerRole: profile.role,
    rowCount,
    createdAt: toIsoString(row.createdAt),
    completedAt: row.completedAt ? toIsoString(row.completedAt) : '',
  };
}

type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';
type NotificationPayload = {
  type: string;
  severity?: NotificationSeverity;
  title: string;
  body: string;
  entityType: string;
  entityId: string;
  actionView: string;
  metadata?: Record<string, unknown>;
};

function sanitizeNotification(row: typeof schema.notification.$inferSelect) {
  return {
    id: row.id,
    type: row.type,
    severity: row.severity as NotificationSeverity,
    title: row.title,
    body: row.body,
    entityType: row.entityType,
    entityId: row.entityId,
    actionView: row.actionView,
    metadata: parseJsonObject(row.metadata),
    readAt: row.readAt ? toIsoString(row.readAt) : '',
    createdAt: toIsoString(row.createdAt),
  };
}

async function createNotificationsForRecipients(recipientUserIds: string[], payload: NotificationPayload) {
  const uniqueRecipientUserIds = Array.from(new Set(recipientUserIds.filter(Boolean)));
  if (!uniqueRecipientUserIds.length) return;
  const now = new Date();
  const notificationRows = uniqueRecipientUserIds.map((recipientUserId) => ({
    id: nanoid(),
    recipientUserId,
    type: payload.type,
    severity: payload.severity ?? 'info',
    title: payload.title,
    body: payload.body,
    entityType: payload.entityType,
    entityId: payload.entityId,
    actionView: payload.actionView,
    metadata: json(payload.metadata ?? {}),
    readAt: null,
    createdAt: now,
  }));
  await db.insert(schema.notification).values(notificationRows);
  void deliverPushNotifications(notificationRows).catch((error) => {
    console.error('Web Push delivery failed', error);
  });
}

async function deliverPushNotifications(notificationRows: Array<typeof schema.notification.$inferInsert>) {
  const pushStatus = getPushPublicStatus();
  if (!pushStatus.enabled) return;

  const recipientUserIds = Array.from(new Set(notificationRows.map((row) => row.recipientUserId).filter(Boolean)));
  if (!recipientUserIds.length) return;

  const subscriptions = await db.query.pushSubscription.findMany({
    where: and(inArray(schema.pushSubscription.recipientUserId, recipientUserIds), isNull(schema.pushSubscription.revokedAt)),
  });
  if (!subscriptions.length) return;

  const notificationByRecipient = new Map(notificationRows.map((row) => [row.recipientUserId, row]));
  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      const notification = notificationByRecipient.get(subscription.recipientUserId);
      if (!notification) return;

      const now = new Date();
      try {
        await sendPushNotification(
          {
            endpoint: subscription.endpoint,
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
          {
            notificationId: notification.id ?? '',
            type: notification.type,
            severity: notification.severity ?? 'info',
            title: notification.title,
            body: notification.body,
            actionView: notification.actionView,
            entityType: notification.entityType,
            entityId: notification.entityId,
            createdAt: toIsoString(notification.createdAt ?? now),
          },
        );
        await db
          .update(schema.pushSubscription)
          .set({ lastPushAt: now, lastErrorAt: null, lastError: null, updatedAt: now })
          .where(eq(schema.pushSubscription.id, subscription.id));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Web Push delivery failed';
        await db
          .update(schema.pushSubscription)
          .set({
            lastErrorAt: now,
            lastError: message.slice(0, 500),
            revokedAt: isExpiredPushSubscriptionError(error) ? now : subscription.revokedAt,
            updatedAt: now,
          })
          .where(eq(schema.pushSubscription.id, subscription.id));
      }
    }),
  );
}

async function activeProfileIdsByRole(roles: Array<z.infer<typeof roleSchema>>) {
  const rows = await db.query.userProfile.findMany({ where: eq(schema.userProfile.status, 'Active') });
  return rows.filter((row) => roles.includes(row.role as z.infer<typeof roleSchema>)).map((row) => row.id);
}

async function notifyRoles(roles: Array<z.infer<typeof roleSchema>>, payload: NotificationPayload, excludeUserIds: string[] = []) {
  const excluded = new Set(excludeUserIds);
  const recipientIds = (await activeProfileIdsByRole(roles)).filter((id) => !excluded.has(id));
  await createNotificationsForRecipients(recipientIds, payload);
}

function percent(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function topBars(counts: Record<string, number>, colors: string[], limit = 6) {
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([label, value], index) => ({ label, value, color: colors[index % colors.length] }));
}

function hasRole(profile: typeof schema.userProfile.$inferSelect, roles: string[]) {
  return roles.includes(profile.role);
}

function combineWhere(conditions: Array<SQL | undefined>) {
  const active = conditions.filter((condition): condition is SQL => Boolean(condition));
  if (!active.length) return undefined;
  return active.length === 1 ? active[0] : and(...active);
}

function surveyVisibilityWhere(profile: typeof schema.userProfile.$inferSelect) {
  if (profile.role === 'Surveyor') return eq(schema.surveyResult.surveyorId, profile.id);
  if (profile.role === 'Manager') return eq(schema.surveyResult.managerId, profile.id);
  return undefined;
}

function visibleSurveyWhere(profile: typeof schema.userProfile.$inferSelect, cursor?: string) {
  const visibility = surveyVisibilityWhere(profile);
  const cursorDate = cursor ? new Date(cursor) : null;
  const cursorFilter = cursorDate && !Number.isNaN(cursorDate.getTime()) ? lt(schema.surveyResult.submitTime, cursorDate) : undefined;
  return combineWhere([visibility, cursorFilter]);
}

function canReadSurvey(profile: typeof schema.userProfile.$inferSelect, survey: typeof schema.surveyResult.$inferSelect) {
  if (['Head', 'Verificator', 'Administrator'].includes(profile.role)) return true;
  if (profile.role === 'Manager') return survey.managerId === profile.id;
  if (profile.role === 'Surveyor') return survey.surveyorId === profile.id;
  return false;
}

function dateKeyUtcRange(dateKey: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
  const start = new Date(`${dateKey}T00:00:00.000Z`);
  const end = new Date(`${dateKey}T23:59:59.999Z`);
  return Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) ? null : { start, end };
}

async function visibleSurveyRows(profile: typeof schema.userProfile.$inferSelect) {
  const where = visibleSurveyWhere(profile);

  return where
    ? db.query.surveyResult.findMany({ where, orderBy: desc(schema.surveyResult.submitTime) })
    : db.query.surveyResult.findMany({ orderBy: desc(schema.surveyResult.submitTime) });
}

type SurveyResultRow = typeof schema.surveyResult.$inferSelect;
type DashboardMetricKey = z.infer<typeof dashboardMetricSchema>;
type DashboardTimeSeriesMode = z.infer<typeof dashboardTimeSeriesModeSchema>;
type VerificationMetricKey = z.infer<typeof verificationMetricSchema>;
type DashboardMetricTotals = Record<DashboardMetricKey, number>;
type DashboardTimeSeriesPoint = { dateKey: string } & DashboardMetricTotals;

function hasDashboardWarning(row: SurveyResultRow, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  return (
    duplicateAwareWarningFlags(row, duplicateMeta).length > 0 ||
    row.gpsWarningFlag ||
    row.gpsDistanceFromTarget > 100 ||
    !row.storefrontPhotoUrl ||
    !row.interiorPhotoUrl ||
    !row.picPhotoUrl ||
    ['NEED_REVISION', 'REJECTED_INVALID'].includes(row.verificationStatus)
  );
}

function matchesDashboardMetric(row: SurveyResultRow, metric: DashboardMetricKey, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  if (metric === 'submitted') return true;
  if (metric === 'verified') return row.verificationStatus === 'VERIFIED_VALID';
  if (metric === 'hot') return effectiveLeadClassification(row) === 'Hot Lead';
  return hasDashboardWarning(row, duplicateMeta);
}

function dashboardMetricAggregate(rows: SurveyResultRow[], duplicateMeta: Map<string, DuplicateMeta>) {
  return {
    submitted: rows.length,
    verified: rows.filter((row) => row.verificationStatus === 'VERIFIED_VALID').length,
    hot: rows.filter((row) => effectiveLeadClassification(row) === 'Hot Lead').length,
    warnings: rows.filter((row) => hasDashboardWarning(row, duplicateMeta.get(row.id))).length,
    avgMerchant: average(rows.map((row) => row.merchantPotentialScore)),
    avgQuality: average(rows.map((row) => row.dataQualityScore)),
  };
}

const dashboardMetricKeys: DashboardMetricKey[] = ['submitted', 'verified', 'hot', 'warnings'];
const dashboardTimeSeriesTargetDays = 30;
const dashboardTimeSeriesAllSurveyorTarget = 200;
const dashboardTimeSeriesSingleSurveyorTarget = 15;

function emptyDashboardMetricTotals(): DashboardMetricTotals {
  return {
    submitted: 0,
    verified: 0,
    hot: 0,
    warnings: 0,
  };
}

function jakartaDateKeyFromValue(value: Date | number | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function timeSeriesDateFromKey(dateKey: string) {
  return new Date(`${dateKey}T12:00:00+07:00`);
}

function addJakartaDays(dateKey: string, days: number) {
  return jakartaDateKeyFromValue(timeSeriesDateFromKey(dateKey).getTime() + days * 86_400_000);
}

function timeSeriesDayKeys(startKey: string, endKey: string) {
  const start = timeSeriesDateFromKey(startKey).getTime();
  const end = timeSeriesDateFromKey(endKey).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || start > end) return [];

  const keys: string[] = [];
  for (let cursor = start, index = 0; cursor <= end && index < 1200; cursor += 86_400_000, index += 1) {
    const key = jakartaDateKeyFromValue(cursor);
    if (key) keys.push(key);
  }
  return keys;
}

function emptyDashboardTimeSeriesPoint(dateKey: string): DashboardTimeSeriesPoint {
  return {
    dateKey,
    ...emptyDashboardMetricTotals(),
  };
}

function dashboardTimeSeriesTotals(points: DashboardTimeSeriesPoint[], mode: DashboardTimeSeriesMode): DashboardMetricTotals {
  if (!points.length) return emptyDashboardMetricTotals();
  if (mode === 'target') {
    const latest = points[points.length - 1];
    return {
      submitted: latest.submitted,
      verified: latest.verified,
      hot: latest.hot,
      warnings: latest.warnings,
    };
  }

  return points.reduce<DashboardMetricTotals>((totals, point) => {
    dashboardMetricKeys.forEach((metric) => {
      totals[metric] += point[metric];
    });
    return totals;
  }, emptyDashboardMetricTotals());
}

function dashboardTimeSeriesPeak(points: DashboardTimeSeriesPoint[]): DashboardMetricTotals {
  return points.reduce<DashboardMetricTotals>((peak, point) => {
    dashboardMetricKeys.forEach((metric) => {
      peak[metric] = Math.max(peak[metric], point[metric]);
    });
    return peak;
  }, emptyDashboardMetricTotals());
}

function timeSeriesSurveyorKey(row: SurveyResultRow) {
  return row.surveyorId || row.surveyorName || 'unknown';
}

async function dashboardTimeSeriesPayload(
  profile: typeof schema.userProfile.$inferSelect,
  mode: DashboardTimeSeriesMode,
  requestedSurveyorId = 'all',
) {
  const rows = await visibleSurveyRows(profile);
  const surveyors = Array.from(
    rows.reduce<Map<string, { id: string; name: string; submitted: number }>>((options, row) => {
      const id = timeSeriesSurveyorKey(row);
      const current = options.get(id) ?? {
        id,
        name: row.surveyorName || 'Surveyor tidak diketahui',
        submitted: 0,
      };
      current.submitted += 1;
      options.set(id, current);
      return options;
    }, new Map()).values(),
  ).sort((left, right) => left.name.localeCompare(right.name));
  const requestedId = requestedSurveyorId.trim();
  const selectedSurveyorId = requestedId && requestedId !== 'all' && surveyors.some((surveyor) => surveyor.id === requestedId) ? requestedId : 'all';
  const selectedSurveyorName =
    selectedSurveyorId === 'all' ? 'Semua surveyor' : surveyors.find((surveyor) => surveyor.id === selectedSurveyorId)?.name ?? selectedSurveyorId;
  const target = selectedSurveyorId === 'all' ? dashboardTimeSeriesAllSurveyorTarget : dashboardTimeSeriesSingleSurveyorTarget;
  const selectedRows = selectedSurveyorId === 'all' ? rows : rows.filter((row) => timeSeriesSurveyorKey(row) === selectedSurveyorId);
  const timestampedRows = selectedRows
    .map((row) => ({ row, timestamp: new Date(row.submitTime).getTime() }))
    .filter((item) => item.timestamp > 0);
  const generatedAt = new Date().toISOString();

  if (!timestampedRows.length) {
    const totals = emptyDashboardMetricTotals();
    return {
      points: [],
      surveyors,
      summary: {
        mode,
        target,
        targetDays: dashboardTimeSeriesTargetDays,
        selectedSurveyorId,
        selectedSurveyorName,
        firstSubmitDate: '',
        lastSubmitDate: '',
        rangeStart: '',
        rangeEnd: '',
        generatedAt,
        totals,
        peak: emptyDashboardMetricTotals(),
        progressPercent: 0,
      },
    };
  }

  const firstSubmitDate = jakartaDateKeyFromValue(Math.min(...timestampedRows.map((item) => item.timestamp)));
  const lastSubmitDate = jakartaDateKeyFromValue(Math.max(...timestampedRows.map((item) => item.timestamp)));
  const rangeStart = firstSubmitDate;
  const rangeEnd = mode === 'target' ? addJakartaDays(firstSubmitDate, dashboardTimeSeriesTargetDays - 1) : lastSubmitDate;
  const pointsByDate = new Map(timeSeriesDayKeys(rangeStart, rangeEnd).map((dateKey) => [dateKey, emptyDashboardTimeSeriesPoint(dateKey)]));
  const duplicateMeta = duplicateMetaForRows(selectedRows, await visibleVerifiedDuplicateTargets(profile));

  timestampedRows.forEach(({ row, timestamp }) => {
    const dateKey = jakartaDateKeyFromValue(timestamp);
    const point = pointsByDate.get(dateKey);
    if (!point) return;
    point.submitted += 1;
    if (row.verificationStatus === 'VERIFIED_VALID') point.verified += 1;
    if (effectiveLeadClassification(row) === 'Hot Lead') point.hot += 1;
    if (hasDashboardWarning(row, duplicateMeta.get(row.id))) point.warnings += 1;
  });

  const dailyPoints = Array.from(pointsByDate.values()).sort(
    (left, right) => timeSeriesDateFromKey(left.dateKey).getTime() - timeSeriesDateFromKey(right.dateKey).getTime(),
  );
  const points =
    mode === 'runRate'
      ? dailyPoints
      : dailyPoints.map((point, index) => {
          const previous = index > 0 ? dailyPoints[index - 1] : null;
          if (previous) {
            dashboardMetricKeys.forEach((metric) => {
              point[metric] += previous[metric];
            });
          }
          return point;
        });
  const totals = dashboardTimeSeriesTotals(points, mode);

  return {
    points,
    surveyors,
    summary: {
      mode,
      target,
      targetDays: dashboardTimeSeriesTargetDays,
      selectedSurveyorId,
      selectedSurveyorName,
      firstSubmitDate,
      lastSubmitDate,
      rangeStart,
      rangeEnd,
      generatedAt,
      totals,
      peak: dashboardTimeSeriesPeak(points),
      progressPercent: target ? Math.min(100, Math.round((totals.submitted / target) * 100)) : 0,
    },
  };
}

async function dashboardMetricRows(profile: typeof schema.userProfile.$inferSelect, metric: DashboardMetricKey) {
  const rows = await visibleSurveyRows(profile);
  const duplicateMeta = duplicateMetaForRows(rows, await visibleVerifiedDuplicateTargets(profile));
  return {
    rows: rows.filter((row) => matchesDashboardMetric(row, metric, duplicateMeta.get(row.id))),
    duplicateMeta,
  };
}

const openVerificationStatuses = ['WAITING_VERIFICATION', 'WAITING_VERIFICATION_WARNING'];
const verificationHistoryStatuses = ['VERIFIED_VALID', 'NEED_REVISION', 'REJECTED_INVALID', 'MERGED_DUPLICATE'];

function isOpenVerificationRow(row: SurveyResultRow) {
  return openVerificationStatuses.includes(row.verificationStatus);
}

function isVerificationHistoryRow(row: SurveyResultRow) {
  return verificationHistoryStatuses.includes(row.verificationStatus);
}

function hasVerificationGpsWarning(row: SurveyResultRow) {
  return row.gpsWarningFlag || row.gpsDistanceFromTarget > 100;
}

function hasVerificationMissingPhoto(row: SurveyResultRow, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  return !row.interiorPhotoUrl || !row.picPhotoUrl || duplicateAwareWarningFlags(row, duplicateMeta).some((flag) => flag.includes('MISSING'));
}

function hasVerificationDuplicate(row: SurveyResultRow, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  return duplicateMeta.duplicateCandidateCount > 0;
}

function hasVerificationWarning(row: SurveyResultRow, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  return duplicateAwareWarningFlags(row, duplicateMeta).length > 0;
}

function matchesVerificationMetric(row: SurveyResultRow, metric: VerificationMetricKey, duplicateMeta: DuplicateMeta = emptyDuplicateMeta) {
  if (!isOpenVerificationRow(row)) return false;
  if (metric === 'pending' || metric === 'surveyors') return true;
  if (metric === 'warning') return hasVerificationWarning(row, duplicateMeta);
  if (metric === 'gps') return hasVerificationGpsWarning(row);
  if (metric === 'missingPhoto') return hasVerificationMissingPhoto(row, duplicateMeta);
  return hasVerificationDuplicate(row, duplicateMeta);
}

function verificationMetricAggregate(rows: SurveyResultRow[], duplicateMeta: Map<string, DuplicateMeta>) {
  return {
    warning: rows.filter((row) => hasVerificationWarning(row, duplicateMeta.get(row.id))).length,
    gps: rows.filter(hasVerificationGpsWarning).length,
    missingPhoto: rows.filter((row) => hasVerificationMissingPhoto(row, duplicateMeta.get(row.id))).length,
    duplicate: rows.filter((row) => hasVerificationDuplicate(row, duplicateMeta.get(row.id))).length,
    hot: rows.filter((row) => ['Hot Lead', 'Qualified Lead'].includes(effectiveLeadClassification(row))).length,
    avgQuality: average(rows.map((row) => row.dataQualityScore)),
  };
}

async function verificationMetricDataset(profile: typeof schema.userProfile.$inferSelect) {
  const rows = await visibleSurveyRows(profile);
  const openRows = rows.filter(isOpenVerificationRow);
  const duplicateMeta = duplicateMetaForRows(openRows, await visibleVerifiedDuplicateTargets(profile));
  return { openRows, duplicateMeta };
}

function buildVerificationMetricSummary(openRows: SurveyResultRow[], duplicateMeta: Map<string, DuplicateMeta>) {
  const oldestRow = openRows.reduce<SurveyResultRow | null>(
    (candidate, row) => (!candidate || Number(row.submitTime) < Number(candidate.submitTime) ? row : candidate),
    null,
  );

  return {
    pending: openRows.length,
    surveyors: new Set(openRows.map((row) => row.surveyorId || row.surveyorName || 'unknown')).size,
    warning: openRows.filter((row) => hasVerificationWarning(row, duplicateMeta.get(row.id))).length,
    gps: openRows.filter(hasVerificationGpsWarning).length,
    missingPhoto: openRows.filter((row) => hasVerificationMissingPhoto(row, duplicateMeta.get(row.id))).length,
    duplicate: openRows.filter((row) => hasVerificationDuplicate(row, duplicateMeta.get(row.id))).length,
    oldestSubmitTime: oldestRow ? toIsoString(oldestRow.submitTime) : '',
  };
}

function verificationHistoryTimestamp(row: SurveyResultRow) {
  return row.verifiedAt ?? row.updatedAt ?? row.submitTime;
}

function buildVerificationHistoryGroups(rows: SurveyResultRow[]) {
  const groups = new Map<
    string,
    {
      surveyorId: string;
      surveyorName: string;
      managerName: string;
      count: number;
      verified: number;
      needRevision: number;
      rejected: number;
      mergedDuplicate: number;
      warning: number;
      hot: number;
      qualityScores: number[];
      oldestSubmitTime: Date | null;
      latestSubmitTime: Date | null;
      latestVerifiedAt: Date | null;
    }
  >();

  for (const row of rows) {
    const key = row.surveyorId || row.surveyorName || 'unknown';
    const group =
      groups.get(key) ??
      {
        surveyorId: row.surveyorId,
        surveyorName: row.surveyorName,
        managerName: row.managerName,
        count: 0,
        verified: 0,
        needRevision: 0,
        rejected: 0,
        mergedDuplicate: 0,
        warning: 0,
        hot: 0,
        qualityScores: [],
        oldestSubmitTime: null,
        latestSubmitTime: null,
        latestVerifiedAt: null,
      };

    group.count += 1;
    group.verified += row.verificationStatus === 'VERIFIED_VALID' ? 1 : 0;
    group.needRevision += row.verificationStatus === 'NEED_REVISION' ? 1 : 0;
    group.rejected += row.verificationStatus === 'REJECTED_INVALID' ? 1 : 0;
    group.mergedDuplicate += row.verificationStatus === 'MERGED_DUPLICATE' ? 1 : 0;
    group.warning += (parseJsonArray(row.warningFlags).length > 0 || ['NEED_REVISION', 'REJECTED_INVALID'].includes(row.verificationStatus)) ? 1 : 0;
    group.hot += ['Hot Lead', 'Qualified Lead'].includes(effectiveLeadClassification(row)) ? 1 : 0;
    group.qualityScores.push(row.dataQualityScore);
    group.oldestSubmitTime = !group.oldestSubmitTime || Number(row.submitTime) < Number(group.oldestSubmitTime) ? row.submitTime : group.oldestSubmitTime;
    group.latestSubmitTime = !group.latestSubmitTime || Number(row.submitTime) > Number(group.latestSubmitTime) ? row.submitTime : group.latestSubmitTime;
    const checkedAt = verificationHistoryTimestamp(row);
    group.latestVerifiedAt = !group.latestVerifiedAt || Number(checkedAt) > Number(group.latestVerifiedAt) ? checkedAt : group.latestVerifiedAt;
    groups.set(key, group);
  }

  return Array.from(groups.values())
    .map((group) => ({
      surveyorId: group.surveyorId,
      surveyorName: group.surveyorName,
      managerName: group.managerName,
      count: group.count,
      verified: group.verified,
      needRevision: group.needRevision,
      rejected: group.rejected,
      mergedDuplicate: group.mergedDuplicate,
      warning: group.warning,
      hot: group.hot,
      avgQuality: average(group.qualityScores),
      oldestSubmitTime: group.oldestSubmitTime ? toIsoString(group.oldestSubmitTime) : '',
      latestSubmitTime: group.latestSubmitTime ? toIsoString(group.latestSubmitTime) : '',
      latestVerifiedAt: group.latestVerifiedAt ? toIsoString(group.latestVerifiedAt) : '',
    }))
    .sort((left, right) => Date.parse(right.latestVerifiedAt || right.latestSubmitTime) - Date.parse(left.latestVerifiedAt || left.latestSubmitTime));
}

async function verificationHistoryRows(profile: typeof schema.userProfile.$inferSelect) {
  const rows = await visibleSurveyRows(profile);
  return rows.filter(isVerificationHistoryRow);
}

async function verificationMetricRows(profile: typeof schema.userProfile.$inferSelect, metric: VerificationMetricKey) {
  const { openRows, duplicateMeta } = await verificationMetricDataset(profile);
  return {
    rows: openRows.filter((row) => matchesVerificationMetric(row, metric, duplicateMeta.get(row.id))),
    duplicateMeta,
  };
}

async function verificationMetricStoreRows(
  profile: typeof schema.userProfile.$inferSelect,
  metric: VerificationMetricKey,
  surveyorId: string,
  limit: number,
) {
  const where = combineWhere([
    surveyVisibilityWhere(profile),
    inArray(schema.surveyResult.verificationStatus, openVerificationStatuses),
    eq(schema.surveyResult.surveyorId, surveyorId),
  ]);
  const surveyorOpenRows = await db.query.surveyResult.findMany({
    where,
    orderBy: asc(schema.surveyResult.submitTime),
  });

  const needsDuplicateMetaForFilter = metric === 'warning' || metric === 'duplicate';
  const verifiedRows = await visibleVerifiedDuplicateTargets(profile);
  const filterDuplicateMeta = needsDuplicateMetaForFilter ? duplicateMetaForRows(surveyorOpenRows, verifiedRows) : new Map<string, DuplicateMeta>();
  const filteredRows = surveyorOpenRows
    .filter((row) => matchesVerificationMetric(row, metric, filterDuplicateMeta.get(row.id)))
    .slice(0, limit);
  const duplicateMeta = needsDuplicateMetaForFilter ? filterDuplicateMeta : duplicateMetaForRows(filteredRows, verifiedRows);

  return { rows: filteredRows, duplicateMeta };
}

const duplicateCandidateSourceStatuses = ['WAITING_VERIFICATION', 'WAITING_VERIFICATION_WARNING'];

async function visibleVerifiedDuplicateTargets(profile: typeof schema.userProfile.$inferSelect) {
  const visibility = visibleSurveyWhere(profile);
  const verifiedStatus = eq(schema.surveyResult.verificationStatus, 'VERIFIED_VALID');
  const where = visibility ? and(visibility, verifiedStatus) : verifiedStatus;

  return db.query.surveyResult.findMany({ where, orderBy: desc(schema.surveyResult.submitTime) });
}

function mergeSurveyRowsById(rows: Array<typeof schema.surveyResult.$inferSelect>) {
  return Array.from(new Map(rows.map((row) => [row.id, row])).values());
}

function normalizeDuplicateTextMatch(value: string | null | undefined) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function addDuplicateIndexEntry(index: Map<string, SurveyResultRow[]>, key: string, row: SurveyResultRow) {
  if (!key) return;
  const rows = index.get(key) ?? [];
  rows.push(row);
  index.set(key, rows);
}

function duplicateCandidateIndexes(verifiedRows: SurveyResultRow[]) {
  const byStoreName = new Map<string, SurveyResultRow[]>();
  const byWhatsappNumber = new Map<string, SurveyResultRow[]>();

  for (const row of verifiedRows) {
    addDuplicateIndexEntry(byStoreName, normalizeStoreMatch(row.storeName), row);
    addDuplicateIndexEntry(byWhatsappNumber, normalizeDuplicateTextMatch(row.whatsappNumber), row);
  }

  return { byStoreName, byWhatsappNumber };
}

function indexedVerifiedCandidates(row: SurveyResultRow, indexes: ReturnType<typeof duplicateCandidateIndexes>) {
  const candidates = new Map<string, SurveyResultRow>();
  const storeNameKey = normalizeStoreMatch(row.storeName);
  const whatsappKey = normalizeDuplicateTextMatch(row.whatsappNumber);

  for (const candidate of indexes.byStoreName.get(storeNameKey) ?? []) {
    candidates.set(candidate.id, candidate);
  }
  for (const candidate of indexes.byWhatsappNumber.get(whatsappKey) ?? []) {
    candidates.set(candidate.id, candidate);
  }

  return Array.from(candidates.values());
}

function duplicateMetaForRows(subjectRows: Array<typeof schema.surveyResult.$inferSelect>, verifiedRows: Array<typeof schema.surveyResult.$inferSelect>) {
  const result = new Map<string, DuplicateMeta>();
  if (!subjectRows.length || !verifiedRows.length) return result;
  const verifiedIndexes = duplicateCandidateIndexes(verifiedRows);

  for (const row of subjectRows) {
    if (!duplicateCandidateSourceStatuses.includes(row.verificationStatus)) continue;
    const verifiedCandidates = indexedVerifiedCandidates(row, verifiedIndexes);
    if (!verifiedCandidates.length) continue;

    const candidateLimit = Math.max(verifiedCandidates.length, 1);
    const contextRows = mergeSurveyRowsById([row, ...verifiedCandidates]);
    const candidates = topDuplicateCandidates(contextRows, row, '', candidateLimit).filter(({ score }) => score >= DUPLICATE_WARNING_THRESHOLD);
    if (!candidates.length) continue;
    result.set(row.id, {
      duplicateCandidateCount: candidates.length,
      duplicateTopScore: candidates[0]?.score ?? 0,
    });
  }

  return result;
}

function exportRowCount(kind: string, surveys: Array<typeof schema.surveyResult.$inferSelect>) {
  if (kind === 'verified-store-database') return surveys.filter((row) => row.verificationStatus === 'VERIFIED_VALID').length;
  if (kind === 'hot-qualified-leads') return surveys.filter((row) => ['Hot Lead', 'Qualified Lead'].includes(effectiveLeadClassification(row))).length;
  if (kind === 'supplier-brand-intelligence') return surveys.length;
  if (kind === 'photo-evidence-links') return surveys.filter((row) => row.storefrontPhotoUrl || row.interiorPhotoUrl || row.picPhotoUrl).length;
  if (kind === 'surveyor-performance') return new Set(surveys.map((row) => row.surveyorId)).size;
  return surveys.length;
}

async function writeAudit(profile: typeof schema.userProfile.$inferSelect, action: string, entityType: string, entityId: string, details: unknown) {
  await db.insert(schema.auditLog).values({
    id: nanoid(),
    actorId: profile.id,
    actorRole: profile.role,
    action,
    entityType,
    entityId,
    details: json(details),
    createdAt: new Date(),
  });
}

type ImportKind = keyof typeof importTemplateHeaders;
type ImportRow = Record<string, string>;
type ProfileWithUser = { profile: typeof schema.userProfile.$inferSelect; authUser: typeof schema.user.$inferSelect };

function isImportKind(value: string): value is ImportKind {
  return Object.prototype.hasOwnProperty.call(importTemplateHeaders, value);
}

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&amp;/g, '&');
}

function xmlAttr(attrs: string, name: string) {
  const match = attrs.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function columnIndexFromCellRef(reference: string) {
  const letters = reference.match(/[A-Z]+/i)?.[0].toUpperCase() ?? 'A';
  return letters.split('').reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function zipEntries(buffer: Buffer) {
  let endOfCentralDirectory = -1;
  for (let cursor = buffer.length - 22; cursor >= 0; cursor -= 1) {
    if (buffer.readUInt32LE(cursor) === 0x06054b50) {
      endOfCentralDirectory = cursor;
      break;
    }
  }
  if (endOfCentralDirectory < 0) throw new Error('File XLSX tidak valid.');

  const entryCount = buffer.readUInt16LE(endOfCentralDirectory + 10);
  const centralDirectoryOffset = buffer.readUInt32LE(endOfCentralDirectory + 16);
  if (entryCount > maxXlsxEntries) throw new Error('File XLSX memiliki terlalu banyak entry.');
  const files = new Map<string, Buffer>();
  let cursor = centralDirectoryOffset;
  let totalUncompressedBytes = 0;

  for (let index = 0; index < entryCount; index += 1) {
    if (cursor + 46 > buffer.length) throw new Error('Struktur XLSX tidak valid.');
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) throw new Error('Struktur XLSX tidak valid.');
    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localHeaderOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.subarray(cursor + 46, cursor + 46 + nameLength).toString('utf8');
    if (uncompressedSize > maxXlsxEntryBytes) throw new Error('Entry XLSX terlalu besar.');
    totalUncompressedBytes += uncompressedSize;
    if (totalUncompressedBytes > maxXlsxTotalBytes) throw new Error('File XLSX terlalu besar setelah diekstrak.');
    if (localHeaderOffset + 30 > buffer.length) throw new Error('Struktur XLSX tidak valid.');

    const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    if (dataStart + compressedSize > buffer.length) throw new Error('Struktur XLSX tidak valid.');
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    const content = method === 0 ? compressed : method === 8 ? inflateRawSync(compressed) : null;
    if (!content) throw new Error(`Metode kompresi XLSX tidak didukung: ${method}`);
    if (content.byteLength !== uncompressedSize || content.byteLength > maxXlsxEntryBytes) throw new Error('Ukuran entry XLSX tidak valid.');

    files.set(name, content);
    cursor += 46 + nameLength + extraLength + commentLength;
  }

  return files;
}

function parseSharedStrings(xml: string) {
  const strings: string[] = [];
  const itemPattern = /<si\b[^>]*>([\s\S]*?)<\/si>/gi;
  let itemMatch: RegExpExecArray | null;
  while ((itemMatch = itemPattern.exec(xml))) {
    const textParts = Array.from(itemMatch[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/gi)).map((match) => decodeXml(match[1]));
    strings.push(textParts.join(''));
  }
  return strings;
}

function parseSheetRows(sheetXml: string, sharedStrings: string[]) {
  const rows: string[][] = [];
  const rowPattern = /<row\b[^>]*>([\s\S]*?)<\/row>/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowPattern.exec(sheetXml))) {
    const row: string[] = [];
    const cellPattern = /<c\b([^>]*)>([\s\S]*?)<\/c>/gi;
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellPattern.exec(rowMatch[1]))) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const reference = xmlAttr(attrs, 'r');
      const type = xmlAttr(attrs, 't');
      const valueMatch = body.match(/<v\b[^>]*>([\s\S]*?)<\/v>/i);
      const inlineMatch = body.match(/<is\b[^>]*>[\s\S]*?<t\b[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/is>/i);
      const columnIndex = reference ? columnIndexFromCellRef(reference) : row.length;
      let value = '';
      if (type === 'inlineStr') value = inlineMatch ? decodeXml(inlineMatch[1]) : '';
      else if (type === 's') value = sharedStrings[Number(valueMatch?.[1] ?? 0)] ?? '';
      else value = valueMatch ? decodeXml(valueMatch[1]) : '';
      row[columnIndex] = value.trim();
    }
    rows.push(row.map((value) => value ?? ''));
  }
  return rows;
}

function parseXlsxRows(dataBase64: string) {
  const files = zipEntries(Buffer.from(dataBase64, 'base64'));
  const sheetEntry = files.get('xl/worksheets/sheet1.xml') ?? Array.from(files.entries()).find(([path]) => path.startsWith('xl/worksheets/') && path.endsWith('.xml'))?.[1];
  if (!sheetEntry) throw new Error('Sheet pertama tidak ditemukan di file XLSX.');
  const sharedStrings = files.get('xl/sharedStrings.xml') ? parseSharedStrings(files.get('xl/sharedStrings.xml')!.toString('utf8')) : [];
  return parseSheetRows(sheetEntry.toString('utf8'), sharedStrings);
}

function rowsFromXlsx(dataBase64: string, expectedHeaders: readonly string[]) {
  const rows = parseXlsxRows(dataBase64).filter((row) => row.some((value) => value.trim()));
  if (!rows.length) throw new Error('Template XLSX kosong.');
  if (rows.length > maxXlsxRows + 1) throw new Error(`Template XLSX maksimal ${maxXlsxRows} baris data.`);
  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const expected = expectedHeaders.map((header) => header.trim().toLowerCase());
  if (headers.length !== expected.length || expected.some((header, index) => headers[index] !== header)) {
    throw new Error(`Header XLSX tidak sesuai template. Header wajib: ${expectedHeaders.join(', ')}`);
  }

  return rows.slice(1).reduce<ImportRow[]>((result, row) => {
    if (!row.some((value) => value.trim())) return result;
    result.push(
      Object.fromEntries(expectedHeaders.map((header, index) => [header, (row[index] ?? '').trim()])),
    );
    return result;
  }, []);
}

async function teamWithUsers() {
  return db
    .select({
      profile: schema.userProfile,
      authUser: schema.user,
    })
    .from(schema.userProfile)
    .innerJoin(schema.user, eq(schema.userProfile.authUserId, schema.user.id));
}

function findTeamMember(team: ProfileWithUser[], value: string, allowedRoles?: string[]) {
  const needle = value.trim().toLowerCase();
  if (!needle) return undefined;
  return team.find((item) => {
    const roleAllowed = !allowedRoles || allowedRoles.includes(item.profile.role);
    return roleAllowed && (item.profile.username.toLowerCase() === needle || item.authUser.name.toLowerCase() === needle);
  });
}

async function ensureAuthUser(input: { name: string; username: string; password: string }) {
  const existing = await db.query.user.findFirst({
    where: eq(schema.user.email, emailForUsername(input.username)),
  });
  return existing ?? signUpAuthUser(input);
}

function parseImportDate(value: string) {
  const trimmed = value.trim();
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const excelEpoch = Date.UTC(1899, 11, 30);
    return new Date(excelEpoch + Number(trimmed) * 86_400_000);
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizePriority(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'high') return 'High';
  if (normalized === 'low') return 'Low';
  return 'Medium';
}

function parseCoordinate(value: string | number | null | undefined) {
  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeOptionalCoordinatePair(latitude: string | null | undefined, longitude: string | null | undefined) {
  const hasLatitude = Boolean(latitude?.trim());
  const hasLongitude = Boolean(longitude?.trim());
  if (!hasLatitude && !hasLongitude) {
    return { latitude: null, longitude: null, error: '' };
  }
  if (!hasLatitude || !hasLongitude) {
    return { latitude: null, longitude: null, error: 'latitude dan longitude harus diisi berpasangan atau dikosongkan keduanya.' };
  }

  const parsedLatitude = parseCoordinate(latitude);
  const parsedLongitude = parseCoordinate(longitude);
  if (parsedLatitude === null || parsedLatitude < -90 || parsedLatitude > 90) {
    return { latitude: null, longitude: null, error: 'latitude harus berupa angka antara -90 sampai 90.' };
  }
  if (parsedLongitude === null || parsedLongitude < -180 || parsedLongitude > 180) {
    return { latitude: null, longitude: null, error: 'longitude harus berupa angka antara -180 sampai 180.' };
  }

  return { latitude: parsedLatitude.toFixed(6), longitude: parsedLongitude.toFixed(6), error: '' };
}

function requiredCoordinateError(latitude: string | null | undefined, longitude: string | null | undefined) {
  const parsedLatitude = parseCoordinate(latitude);
  const parsedLongitude = parseCoordinate(longitude);
  if (parsedLatitude === null || parsedLatitude < -90 || parsedLatitude > 90) return 'latitude submit tidak valid.';
  if (parsedLongitude === null || parsedLongitude < -180 || parsedLongitude > 180) return 'longitude submit tidak valid.';
  return '';
}

function distanceMetersBetween(
  sourceLatitude: string | number,
  sourceLongitude: string | number,
  targetLatitude: string | number | null | undefined,
  targetLongitude: string | number | null | undefined,
) {
  const sourceLat = parseCoordinate(sourceLatitude);
  const sourceLng = parseCoordinate(sourceLongitude);
  const targetLat = parseCoordinate(targetLatitude);
  const targetLng = parseCoordinate(targetLongitude);
  if (sourceLat === null || sourceLng === null || targetLat === null || targetLng === null) return 0;

  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMeters = 6_371_000;
  const deltaLat = toRadians(targetLat - sourceLat);
  const deltaLng = toRadians(targetLng - sourceLng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(sourceLat)) * Math.cos(toRadians(targetLat)) * Math.sin(deltaLng / 2) ** 2;
  return Math.round(earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function importUsers(rows: ImportRow[], profile: typeof schema.userProfile.$inferSelect) {
  const result = { created: 0, skipped: 0, errors: [] as string[] };
  const team = await teamWithUsers();

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    const role = roleSchema.safeParse(row.role);
    const status = row.status ? statusSchema.safeParse(row.status) : { success: true as const, data: 'Active' as const };
    if (!row.name || !row.username || !row.password || !row.phone || !role.success || !status.success) {
      result.errors.push(`Row ${rowNumber}: data user wajib tidak lengkap atau role/status tidak valid.`);
      continue;
    }

    const username = row.username.toLowerCase();
    const existingProfile = await db.query.userProfile.findFirst({ where: eq(schema.userProfile.username, username) });
    if (existingProfile) {
      result.skipped += 1;
      continue;
    }

    const manager = row.manager_username ? findTeamMember(team, row.manager_username, ['Manager']) : undefined;
    if (role.data === 'Surveyor' && !manager) {
      result.errors.push(`Row ${rowNumber}: Surveyor wajib memiliki manager_username yang valid.`);
      continue;
    }

    const authUser = await ensureAuthUser({ name: row.name, username, password: row.password });
    if (!authUser) {
      result.errors.push(`Row ${rowNumber}: auth user gagal dibuat.`);
      continue;
    }

    const now = new Date();
    await db.insert(schema.userProfile).values({
      id: nanoid(),
      authUserId: authUser.id,
      username,
      phone: row.phone,
      role: role.data,
      area: row.area || 'Assigned by import',
      managerId: role.data === 'Surveyor' ? manager?.profile.id : null,
      status: status.data,
      createdAt: now,
      updatedAt: now,
    });
    await writeAudit(profile, 'IMPORT_USER', 'userProfile', username, { rowNumber, role: role.data });
    result.created += 1;
  }

  return result;
}

async function importTargetStores(rows: ImportRow[], profile: typeof schema.userProfile.$inferSelect) {
  const result = { created: 0, skipped: 0, errors: [] as string[] };
  const team = await teamWithUsers();

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    const surveyor = findTeamMember(team, row.assigned_surveyor, ['Surveyor']);
    if (!row.store_name || !row.province || !row.city_regency || !row.address_detail || !row.assigned_surveyor || !row.visit_date) {
      result.errors.push(`Row ${rowNumber}: field minimum target store belum lengkap.`);
      continue;
    }
    if (!surveyor) {
      result.errors.push(`Row ${rowNumber}: assigned_surveyor tidak ditemukan.`);
      continue;
    }
    if (profile.role === 'Manager' && surveyor.profile.managerId !== profile.id) {
      result.errors.push(`Row ${rowNumber}: manager hanya boleh import surveyor di area sendiri.`);
      continue;
    }

    const explicitManager = row.assigned_manager ? findTeamMember(team, row.assigned_manager, ['Manager']) : undefined;
    const manager =
      profile.role === 'Manager'
        ? team.find((item) => item.profile.id === profile.id)
        : explicitManager ?? team.find((item) => item.profile.id === surveyor.profile.managerId);
    if (!manager) {
      result.errors.push(`Row ${rowNumber}: assigned_manager tidak ditemukan.`);
      continue;
    }

    const visitDate = parseImportDate(row.visit_date);
    if (!visitDate) {
      result.errors.push(`Row ${rowNumber}: visit_date tidak valid.`);
      continue;
    }
    const coordinates = normalizeOptionalCoordinatePair(row.latitude, row.longitude);
    if (coordinates.error) {
      result.errors.push(`Row ${rowNumber}: ${coordinates.error}`);
      continue;
    }

    const now = new Date();
    const assignmentRow: typeof schema.assignment.$inferInsert = {
      id: nanoid(),
      storeName: row.store_name,
      province: row.province,
      city: row.city_regency,
      district: row.district || '-',
      village: row.village || '-',
      addressDetail: row.address_detail,
      landmark: row.landmark || '-',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      assignedManagerId: manager.profile.id,
      assignedManagerName: manager.authUser.name,
      assignedSurveyorId: surveyor.profile.id,
      assignedSurveyorName: surveyor.authUser.name,
      visitDate,
      priority: normalizePriority(row.priority),
      visitObjective: 'Survey',
      plannedOrUnplanned: 'PLANNED',
      status: 'READY',
      notes: row.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(schema.assignment).values(assignmentRow);
    await writeAudit(profile, 'IMPORT_ASSIGNMENT', 'assignment', assignmentRow.id, { rowNumber, storeName: assignmentRow.storeName });
    result.created += 1;
  }

  return result;
}

async function importTerritoryMaster(rows: ImportRow[], profile: typeof schema.userProfile.$inferSelect) {
  const result = { created: 0, skipped: 0, errors: [] as string[] };
  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    if (!row.province || !row.city || !row.district || !row.village) {
      result.errors.push(`Row ${rowNumber}: province, city, district, dan village wajib diisi.`);
      continue;
    }
    const existing = await db.query.location.findFirst({
      where: and(eq(schema.location.province, row.province), eq(schema.location.city, row.city), eq(schema.location.district, row.district), eq(schema.location.village, row.village)),
    });
    if (existing) {
      result.skipped += 1;
      continue;
    }
    await db.insert(schema.location).values({
      id: `LOC-IMP-${nanoid(10)}`,
      province: row.province,
      city: row.city,
      district: row.district,
      village: row.village,
    });
    await writeAudit(profile, 'IMPORT_TERRITORY', 'location', `${row.province}/${row.city}/${row.district}/${row.village}`, { rowNumber });
    result.created += 1;
  }
  return result;
}

export function registerApiRoutes(router: Router) {
  router.use((req, _res, next) => {
    if (req.method !== 'GET') clearAnalyticsCache();
    next();
  });

  router.get('/notifications/push/status', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;
    const parsed = pushStatusQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid push status query' });

    const activeRow = rawDb
      .prepare('SELECT COUNT(*) AS count FROM "pushSubscription" WHERE "recipientUserId" = ? AND "revokedAt" IS NULL')
      .get(session.profile.id) as { count: number } | undefined;
    const currentDeviceRow = parsed.data.endpoint
      ? (rawDb
          .prepare(
            'SELECT COUNT(*) AS count FROM "pushSubscription" WHERE "recipientUserId" = ? AND "endpoint" = ? AND "revokedAt" IS NULL',
          )
          .get(session.profile.id, parsed.data.endpoint) as { count: number } | undefined)
      : undefined;

    return res.json({
      ...getPushPublicStatus(),
      activeSubscriptions: activeRow?.count ?? 0,
      currentDeviceSubscribed: Boolean(currentDeviceRow?.count),
    });
  });

  router.post('/notifications/push/subscriptions', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;

    const parsed = pushSubscriptionInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid push subscription payload' });

    const now = new Date();
    const expirationTime = parsed.data.expirationTime ? new Date(parsed.data.expirationTime) : null;
    const userAgent = parsed.data.userAgent || req.get('user-agent') || null;
    const existing = await db.query.pushSubscription.findFirst({
      where: eq(schema.pushSubscription.endpoint, parsed.data.endpoint),
    });

    if (existing) {
      await db
        .update(schema.pushSubscription)
        .set({
          recipientUserId: session.profile.id,
          p256dh: parsed.data.keys.p256dh,
          auth: parsed.data.keys.auth,
          expirationTime,
          userAgent,
          revokedAt: null,
          lastErrorAt: null,
          lastError: null,
          updatedAt: now,
        })
        .where(eq(schema.pushSubscription.id, existing.id));
    } else {
      await db.insert(schema.pushSubscription).values({
        id: nanoid(),
        recipientUserId: session.profile.id,
        endpoint: parsed.data.endpoint,
        p256dh: parsed.data.keys.p256dh,
        auth: parsed.data.keys.auth,
        expirationTime,
        userAgent,
        lastPushAt: null,
        lastErrorAt: null,
        lastError: null,
        revokedAt: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    await writeAudit(session.profile, 'REGISTER_PUSH_SUBSCRIPTION', 'pushSubscription', parsed.data.endpoint, {
      userAgent,
      source: getPushPublicStatus().source,
    });

    return res.status(existing ? 200 : 201).json({ ok: true });
  });

  router.delete('/notifications/push/subscriptions', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;

    const parsed = pushSubscriptionDeleteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid push subscription payload' });

    const now = new Date();
    await db
      .update(schema.pushSubscription)
      .set({ revokedAt: now, updatedAt: now })
      .where(and(eq(schema.pushSubscription.endpoint, parsed.data.endpoint), eq(schema.pushSubscription.recipientUserId, session.profile.id)));

    await writeAudit(session.profile, 'REVOKE_PUSH_SUBSCRIPTION', 'pushSubscription', parsed.data.endpoint, {});
    return res.json({ ok: true });
  });

  router.get('/notifications', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;
    const parsed = notificationListQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid notification list query' });

    const recipientWhere = eq(schema.notification.recipientUserId, session.profile.id);
    const where = parsed.data.unreadOnly ? and(recipientWhere, isNull(schema.notification.readAt)) : recipientWhere;
    const rows = await db.query.notification.findMany({
      where,
      orderBy: desc(schema.notification.createdAt),
      limit: parsed.data.limit,
    });
    const unreadRow = rawDb
      .prepare('SELECT COUNT(*) AS count FROM "notification" WHERE "recipientUserId" = ? AND "readAt" IS NULL')
      .get(session.profile.id) as { count: number } | undefined;

    return res.json({
      notifications: rows.map(sanitizeNotification),
      unreadCount: unreadRow?.count ?? 0,
    });
  });

  router.patch('/notifications/:id/read', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;

    const notification = await db.query.notification.findFirst({
      where: and(eq(schema.notification.id, req.params.id), eq(schema.notification.recipientUserId, session.profile.id)),
    });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    const readAt = notification.readAt ?? new Date();
    if (!notification.readAt) {
      await db.update(schema.notification).set({ readAt }).where(eq(schema.notification.id, notification.id));
    }

    const updated = await db.query.notification.findFirst({ where: eq(schema.notification.id, notification.id) });
    return res.json({ notification: sanitizeNotification(updated ?? { ...notification, readAt }) });
  });

  router.post('/notifications/read-all', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;

    await db
      .update(schema.notification)
      .set({ readAt: new Date() })
      .where(and(eq(schema.notification.recipientUserId, session.profile.id), isNull(schema.notification.readAt)));

    return res.json({ ok: true, unreadCount: 0 });
  });

  router.get('/dashboard/time-series', async (req, res) => {
    const session = await requireRole(req, res, ['Head', 'Manager', 'Verificator', 'Administrator']);
    if (!session) return;
    const parsed = dashboardTimeSeriesQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid dashboard time-series query' });

    return res.json(await dashboardTimeSeriesPayload(session.profile, parsed.data.mode, parsed.data.surveyorId));
  });

  router.get('/dashboard/metrics/:metric/surveyors', async (req, res) => {
    const session = await requireRole(req, res, ['Head', 'Manager', 'Verificator', 'Administrator']);
    if (!session) return;
    const metric = dashboardMetricSchema.safeParse(req.params.metric);
    if (!metric.success) return res.status(400).json({ error: 'Invalid dashboard metric' });

    const { rows, duplicateMeta } = await dashboardMetricRows(session.profile, metric.data);
    const groups = Array.from(
      rows.reduce<
        Map<
          string,
          {
            surveyorId: string;
            surveyorName: string;
            managerName: string;
            rows: SurveyResultRow[];
          }
        >
      >((groupMap, row) => {
        const current = groupMap.get(row.surveyorId) ?? {
          surveyorId: row.surveyorId,
          surveyorName: row.surveyorName,
          managerName: row.managerName,
          rows: [],
        };
        current.rows.push(row);
        groupMap.set(row.surveyorId, current);
        return groupMap;
      }, new Map()).values(),
    )
      .map((group) => {
        const latestRow = group.rows[0];
        return {
          surveyorId: group.surveyorId,
          surveyorName: group.surveyorName,
          managerName: group.managerName,
          count: group.rows.length,
          latestSubmitTime: latestRow ? toIsoString(latestRow.submitTime) : '',
          ...dashboardMetricAggregate(group.rows, duplicateMeta),
        };
      })
      .sort((left, right) => right.count - left.count || left.surveyorName.localeCompare(right.surveyorName));

    return res.json({
      metric: metric.data,
      total: rows.length,
      groups,
    });
  });

  router.get('/dashboard/metrics/:metric/surveyors/:surveyorId/stores', async (req, res) => {
    const session = await requireRole(req, res, ['Head', 'Manager', 'Verificator', 'Administrator']);
    if (!session) return;
    const metric = dashboardMetricSchema.safeParse(req.params.metric);
    if (!metric.success) return res.status(400).json({ error: 'Invalid dashboard metric' });
    const parsed = dashboardMetricStoresQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid dashboard metric store query' });

    const { rows, duplicateMeta } = await dashboardMetricRows(session.profile, metric.data);
    const surveyorRows = rows
      .filter((row) => row.surveyorId === req.params.surveyorId)
      .sort((left, right) => Number(right.submitTime) - Number(left.submitTime))
      .slice(0, parsed.data.limit);

    return res.json({
      metric: metric.data,
      surveyorId: req.params.surveyorId,
      stores: surveyorRows.map((row) => sanitizeSurveyListItem(row, duplicateMeta.get(row.id))),
    });
  });

  router.get('/verification/metrics/summary', async (req, res) => {
    const session = await requireRole(req, res, ['Verificator', 'Administrator']);
    if (!session) return;

    const { openRows, duplicateMeta } = await verificationMetricDataset(session.profile);
    return res.json({ summary: buildVerificationMetricSummary(openRows, duplicateMeta) });
  });

  router.get('/verification/metrics/:metric/surveyors', async (req, res) => {
    const session = await requireRole(req, res, ['Verificator', 'Administrator']);
    if (!session) return;
    const metric = verificationMetricSchema.safeParse(req.params.metric);
    if (!metric.success) return res.status(400).json({ error: 'Invalid verification metric' });

    const { rows, duplicateMeta } = await verificationMetricRows(session.profile, metric.data);
    const groups = Array.from(
      rows.reduce<
        Map<
          string,
          {
            surveyorId: string;
            surveyorName: string;
            managerName: string;
            rows: SurveyResultRow[];
          }
        >
      >((groupMap, row) => {
        const surveyorId = row.surveyorId || row.surveyorName || 'unknown';
        const current = groupMap.get(surveyorId) ?? {
          surveyorId,
          surveyorName: row.surveyorName || 'Surveyor tidak diketahui',
          managerName: row.managerName,
          rows: [],
        };
        current.rows.push(row);
        groupMap.set(surveyorId, current);
        return groupMap;
      }, new Map()).values(),
    )
      .map((group) => {
        const oldestRow = group.rows.reduce((candidate, row) => (Number(row.submitTime) < Number(candidate.submitTime) ? row : candidate), group.rows[0]);
        const latestRow = group.rows.reduce((candidate, row) => (Number(row.submitTime) > Number(candidate.submitTime) ? row : candidate), group.rows[0]);
        return {
          surveyorId: group.surveyorId,
          surveyorName: group.surveyorName,
          managerName: group.managerName,
          count: group.rows.length,
          oldestSubmitTime: oldestRow ? toIsoString(oldestRow.submitTime) : '',
          latestSubmitTime: latestRow ? toIsoString(latestRow.submitTime) : '',
          ...verificationMetricAggregate(group.rows, duplicateMeta),
        };
      })
      .sort((left, right) => Number(new Date(left.oldestSubmitTime)) - Number(new Date(right.oldestSubmitTime)) || left.surveyorName.localeCompare(right.surveyorName));

    return res.json({
      metric: metric.data,
      total: metric.data === 'surveyors' ? groups.length : rows.length,
      groups,
    });
  });

  router.get('/verification/metrics/:metric/surveyors/:surveyorId/stores', async (req, res) => {
    const session = await requireRole(req, res, ['Verificator', 'Administrator']);
    if (!session) return;
    const metric = verificationMetricSchema.safeParse(req.params.metric);
    if (!metric.success) return res.status(400).json({ error: 'Invalid verification metric' });
    const parsed = verificationMetricStoresQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid verification metric store query' });

    const { rows: surveyorRows, duplicateMeta } = await verificationMetricStoreRows(
      session.profile,
      metric.data,
      req.params.surveyorId,
      parsed.data.limit,
    );

    return res.json({
      metric: metric.data,
      surveyorId: req.params.surveyorId,
      stores: surveyorRows.map((row) => sanitizeSurveyListItem(row, duplicateMeta.get(row.id))),
    });
  });

  router.get('/verification/history/surveyors', async (req, res) => {
    const session = await requireRole(req, res, ['Verificator', 'Administrator']);
    if (!session) return;

    const rows = await verificationHistoryRows(session.profile);
    return res.json({
      total: rows.length,
      groups: buildVerificationHistoryGroups(rows),
    });
  });

  router.get('/verification/history/surveyors/:surveyorId/stores', async (req, res) => {
    const session = await requireRole(req, res, ['Verificator', 'Administrator']);
    if (!session) return;
    const parsed = verificationMetricStoresQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid verification history store query' });

    const where = combineWhere([
      surveyVisibilityWhere(session.profile),
      inArray(schema.surveyResult.verificationStatus, verificationHistoryStatuses),
      eq(schema.surveyResult.surveyorId, req.params.surveyorId),
    ]);
    const rows = await db.query.surveyResult.findMany({
      where,
      orderBy: [desc(schema.surveyResult.updatedAt), desc(schema.surveyResult.verifiedAt), desc(schema.surveyResult.submitTime)],
      limit: parsed.data.limit,
    });

    return res.json({
      surveyorId: req.params.surveyorId,
      stores: rows.map((row) => sanitizeSurveyListItem(row)),
    });
  });

  router.get('/analytics', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;

    const cacheKey = analyticsCacheKey(session.profile);
    const cached = analyticsResponseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return res.json(cached.payload);
    analyticsResponseCache.delete(cacheKey);

    const rows = await visibleSurveyRows(session.profile);
    const submitted = rows.length;
    const verified = rows.filter((row) => row.verificationStatus === 'VERIFIED_VALID').length;
    const hot = rows.filter((row) => effectiveLeadClassification(row) === 'Hot Lead').length;
    const qualified = rows.filter((row) => effectiveLeadClassification(row) === 'Qualified Lead').length;
    const warning = rows.filter((row) => parseJsonArray(row.warningFlags).length || ['NEED_REVISION', 'REJECTED_INVALID'].includes(row.verificationStatus)).length;
    const waAvailable = rows.filter((row) => effectiveVerifierWhatsappReachable(row)).length;
    const photoComplete = rows.filter((row) => row.storefrontPhotoUrl && row.interiorPhotoUrl && row.picPhotoUrl).length;
    const supplierDissatisfied = rows.filter((row) => ['Banyak keluhan', 'Kurang puas', 'Sedang cari alternatif'].includes(row.supplierSatisfaction)).length;
    const lowCostAcceptance = rows.filter((row) => ['Sedang', 'Tinggi', 'Campuran', 'Dominan'].includes(row.lowCostImportShare)).length;

    const leadCounts = countBy(rows.map((row) => effectiveLeadClassification(row)));
    const brandCounts = countBy(rows.flatMap((row) => parseJsonArrayOrText(row.coolingBrands)));
    const supplierTypeCounts = countBy(rows.flatMap((row) => parseJsonArrayOrText(row.supplierType)));
    const cityCounts = countBy(rows.map((row) => row.city));
    const managerCounts = Object.entries(
      rows.reduce<Record<string, { submitted: number; verified: number }>>((counts, row) => {
        counts[row.managerName] ??= { submitted: 0, verified: 0 };
        counts[row.managerName].submitted += 1;
        counts[row.managerName].verified += row.verificationStatus === 'VERIFIED_VALID' ? 1 : 0;
        return counts;
      }, {}),
    ).map(([manager, value]) => ({ manager, ...value }));
    const surveyorPerformance = Object.entries(
      rows.reduce<Record<string, { submitted: number; verified: number; hotLead: number; dataQualityScores: number[]; merchantScores: number[]; warning: number }>>(
        (counts, row) => {
          counts[row.surveyorName] ??= { submitted: 0, verified: 0, hotLead: 0, dataQualityScores: [], merchantScores: [], warning: 0 };
          counts[row.surveyorName].submitted += 1;
          counts[row.surveyorName].verified += row.verificationStatus === 'VERIFIED_VALID' ? 1 : 0;
          counts[row.surveyorName].hotLead += effectiveLeadClassification(row) === 'Hot Lead' ? 1 : 0;
          counts[row.surveyorName].dataQualityScores.push(row.dataQualityScore);
          counts[row.surveyorName].merchantScores.push(row.merchantPotentialScore);
          counts[row.surveyorName].warning += parseJsonArray(row.warningFlags).length ? 1 : 0;
          return counts;
        },
        {},
      ),
    )
      .map(([surveyor, value]) => ({
        surveyor,
        submitted: value.submitted,
        verified: value.verified,
        hotLead: value.hotLead,
        warning: value.warning,
        averageDataQualityScore: average(value.dataQualityScores),
        averageMerchantScore: average(value.merchantScores),
        validRate: percent(value.verified, value.submitted),
      }))
      .sort((left, right) => right.verified - left.verified || right.averageDataQualityScore - left.averageDataQualityScore);

    const exportRows = await db.query.exportJob.findMany({ orderBy: asc(schema.exportJob.name) });

    const payload = {
      metrics: {
        submitted,
        verified,
        hot,
        qualified,
        warning,
        avgMerchantScore: average(rows.map((row) => row.merchantPotentialScore)),
        avgDataQuality: average(rows.map((row) => row.dataQualityScore)),
        waContactability: percent(waAvailable, submitted),
        supplierDissatisfaction: percent(supplierDissatisfied, submitted),
        lowCostImportAcceptance: percent(lowCostAcceptance, submitted),
        photoEvidenceComplete: percent(photoComplete, submitted),
        validRate: percent(verified, submitted),
      },
      leadBars: topBars(leadCounts, ['#f5c84c', '#2fd0a8', '#61c8ff', '#ff8b73', '#b28cff']),
      brandBars: topBars(brandCounts, ['#2fd0a8', '#61c8ff', '#f5c84c', '#ff8b73', '#b28cff']),
      supplierTypeBars: topBars(supplierTypeCounts, ['#61c8ff', '#2fd0a8', '#f5c84c', '#b28cff', '#ff8b73']),
      cityBars: topBars(cityCounts, ['#2fd0a8', '#61c8ff', '#f5c84c', '#ff8b73', '#b28cff'], 10),
      managerPerformance: managerCounts,
      surveyorPerformance,
      hotLeadPreview: rows
        .filter((row) => ['Hot Lead', 'Qualified Lead'].includes(effectiveLeadClassification(row)))
        .slice(0, 25)
        .map((row) => sanitizeSurvey(row)),
      exportJobs: exportRows.map((row) => sanitizeExportJob(row, exportRowCount(row.kind, rows), session.profile)),
      systemStatus: [
        { label: 'Backend SQLite', enabled: true, detail: `${submitted.toLocaleString('id-ID')} survey rows` },
        {
          label: 'Territory master',
          enabled: true,
          detail: `${locationMasterCount()} locations`,
        },
        { label: 'Camera-only evidence', enabled: true, detail: 'Native camera capture + backend evidence URL' },
        { label: 'Role based access', enabled: true, detail: 'Frontend navigation + backend API guard' },
      ],
    };
    analyticsResponseCache.set(cacheKey, { expiresAt: Date.now() + analyticsCacheTtlMs, payload });
    return res.json(payload);
  });

  router.get('/team/surveyors', async (req, res) => {
    const session = await requireRole(req, res, ['Head', 'Manager', 'Administrator']);
    if (!session) return;

    const rows = await db
      .select({
        profile: schema.userProfile,
        authUser: schema.user,
      })
      .from(schema.userProfile)
      .innerJoin(schema.user, eq(schema.userProfile.authUserId, schema.user.id));

    const surveyors = rows
      .filter((row) => row.profile.role === 'Surveyor' && row.profile.status === 'Active')
      .filter((row) => (session.profile.role === 'Manager' ? row.profile.managerId === session.profile.id : true))
      .map((row) => sanitizeUser(row.profile, row.authUser));

    return res.json({ surveyors });
  });

  router.get('/assignments', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;
    const parsed = assignmentListQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid assignment list query' });

    const roleWhere =
      session.profile.role === 'Surveyor'
        ? eq(schema.assignment.assignedSurveyorId, session.profile.id)
        : session.profile.role === 'Manager'
          ? eq(schema.assignment.assignedManagerId, session.profile.id)
          : undefined;
    const visitDateRange = parsed.data.visitDate ? dateKeyUtcRange(parsed.data.visitDate) : null;
    if (parsed.data.visitDate && !visitDateRange) return res.status(400).json({ error: 'visitDate is invalid' });
    const dateWhere = visitDateRange ? and(gte(schema.assignment.visitDate, visitDateRange.start), lte(schema.assignment.visitDate, visitDateRange.end)) : undefined;
    const where = roleWhere && dateWhere ? and(roleWhere, dateWhere) : roleWhere ?? dateWhere;

    const rows = where
      ? await db.query.assignment.findMany({ where, orderBy: asc(schema.assignment.visitDate), limit: parsed.data.limit })
      : await db.query.assignment.findMany({ orderBy: asc(schema.assignment.visitDate), limit: parsed.data.limit });

    return res.json({ assignments: rows.map(sanitizeAssignment) });
  });

  router.post('/assignments', async (req, res) => {
    const session = await requireRole(req, res, ['Manager', 'Administrator']);
    if (!session) return;

    const parsed = assignmentInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid assignment payload' });
    const coordinates = normalizeOptionalCoordinatePair(parsed.data.latitude, parsed.data.longitude);
    if (coordinates.error) return res.status(400).json({ error: coordinates.error });

    if (!locationExists(parsed.data)) return res.status(400).json({ error: 'Location does not exist in master location data' });

    const surveyorProfile = await db.query.userProfile.findFirst({ where: eq(schema.userProfile.id, parsed.data.assignedSurveyorId) });
    if (!surveyorProfile || surveyorProfile.role !== 'Surveyor' || surveyorProfile.status !== 'Active') {
      return res.status(400).json({ error: 'Assigned surveyor is invalid or inactive' });
    }
    if (session.profile.role === 'Manager' && surveyorProfile.managerId !== session.profile.id) {
      return res.status(403).json({ error: 'Manager can only assign own surveyor team' });
    }
    const surveyorAuthUser = await db.query.user.findFirst({ where: eq(schema.user.id, surveyorProfile.authUserId) });
    if (!surveyorAuthUser) return res.status(400).json({ error: 'Assigned surveyor auth user not found' });

    const managerProfile =
      session.profile.role === 'Manager'
        ? session.profile
        : surveyorProfile.managerId
          ? await db.query.userProfile.findFirst({ where: eq(schema.userProfile.id, surveyorProfile.managerId) })
          : session.profile;
    const managerAuthUser = managerProfile ? await db.query.user.findFirst({ where: eq(schema.user.id, managerProfile.authUserId) }) : null;
    const now = new Date();
    const row: typeof schema.assignment.$inferInsert = {
      id: nanoid(),
      storeName: parsed.data.storeName,
      province: parsed.data.province,
      city: parsed.data.city,
      district: parsed.data.district,
      village: parsed.data.village,
      addressDetail: parsed.data.addressDetail,
      landmark: parsed.data.landmark,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      assignedManagerId: managerProfile?.id ?? session.profile.id,
      assignedManagerName: managerAuthUser?.name ?? session.user.name,
      assignedSurveyorId: surveyorProfile.id,
      assignedSurveyorName: surveyorAuthUser.name,
      visitDate: new Date(parsed.data.visitDate),
      priority: parsed.data.priority,
      visitObjective: parsed.data.visitObjective,
      plannedOrUnplanned: 'PLANNED',
      status: parsed.data.status ?? 'READY',
      notes: parsed.data.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(schema.assignment).values(row);
    await writeAudit(session.profile, 'CREATE_ASSIGNMENT', 'assignment', row.id, { storeName: row.storeName, surveyor: row.assignedSurveyorName });
    await createNotificationsForRecipients([surveyorProfile.id], {
      type: 'assignment_created',
      severity: row.priority === 'High' ? 'warning' : 'info',
      title: 'Kunjungan baru ditugaskan',
      body: `${row.storeName} dijadwalkan untuk Anda di ${row.city}/${row.district}.`,
      entityType: 'assignment',
      entityId: row.id,
      actionView: 'surveyor',
      metadata: { storeName: row.storeName, visitDate: toIsoString(row.visitDate), priority: row.priority },
    });
    if (row.assignedManagerId !== session.profile.id) {
      await createNotificationsForRecipients([row.assignedManagerId], {
        type: 'assignment_created',
        severity: 'info',
        title: 'Assignment baru dibuat',
        body: `${row.storeName} ditugaskan ke ${row.assignedSurveyorName}.`,
        entityType: 'assignment',
        entityId: row.id,
        actionView: 'assignments',
        metadata: { storeName: row.storeName, surveyorName: row.assignedSurveyorName, visitDate: toIsoString(row.visitDate) },
      });
    }

    return res.status(201).json({ assignment: sanitizeAssignment(row as typeof schema.assignment.$inferSelect) });
  });

  router.patch('/assignments/:id/reassign', async (req, res) => {
    const session = await requireRole(req, res, ['Manager', 'Administrator']);
    if (!session) return;

    const parsed = reassignmentInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid reassignment payload' });

    const assignment = await db.query.assignment.findFirst({ where: eq(schema.assignment.id, req.params.id) });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    if (session.profile.role === 'Manager' && assignment.assignedManagerId !== session.profile.id) {
      return res.status(403).json({ error: 'Manager can only reassign own area' });
    }

    const surveyorProfile = await db.query.userProfile.findFirst({ where: eq(schema.userProfile.id, parsed.data.assignedSurveyorId) });
    if (!surveyorProfile || surveyorProfile.role !== 'Surveyor' || surveyorProfile.status !== 'Active') {
      return res.status(400).json({ error: 'Assigned surveyor is invalid or inactive' });
    }
    if (session.profile.role === 'Manager' && surveyorProfile.managerId !== session.profile.id) {
      return res.status(403).json({ error: 'Manager can only reassign own surveyor team' });
    }
    const surveyorAuthUser = await db.query.user.findFirst({ where: eq(schema.user.id, surveyorProfile.authUserId) });
    if (!surveyorAuthUser) return res.status(400).json({ error: 'Assigned surveyor auth user not found' });

    const nextProvince = parsed.data.province ?? assignment.province;
    const nextCity = parsed.data.city ?? assignment.city;
    const nextDistrict = parsed.data.district ?? assignment.district;
    const nextVillage = parsed.data.village ?? assignment.village;
    if (!locationExists({ province: nextProvince, city: nextCity, district: nextDistrict, village: nextVillage })) {
      return res.status(400).json({ error: 'Location does not exist in master location data' });
    }

    const hasCoordinatePayload = Object.prototype.hasOwnProperty.call(parsed.data, 'latitude') || Object.prototype.hasOwnProperty.call(parsed.data, 'longitude');
    const coordinates = hasCoordinatePayload
      ? normalizeOptionalCoordinatePair(parsed.data.latitude, parsed.data.longitude)
      : { latitude: assignment.latitude, longitude: assignment.longitude, error: '' };
    if (coordinates.error) return res.status(400).json({ error: coordinates.error });

    const visitDate = parsed.data.visitDate ? new Date(parsed.data.visitDate) : assignment.visitDate;
    if (Number.isNaN(visitDate.getTime())) return res.status(400).json({ error: 'visitDate is invalid' });

    await db
      .update(schema.assignment)
      .set({
        province: nextProvince,
        city: nextCity,
        district: nextDistrict,
        village: nextVillage,
        addressDetail: parsed.data.addressDetail ?? assignment.addressDetail,
        landmark: parsed.data.landmark ?? assignment.landmark,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        assignedSurveyorId: surveyorProfile.id,
        assignedSurveyorName: surveyorAuthUser.name,
        visitDate,
        priority: parsed.data.priority ?? assignment.priority,
        visitObjective: parsed.data.visitObjective ?? assignment.visitObjective,
        status: parsed.data.status ?? 'READY',
        notes: parsed.data.notes ?? assignment.notes,
        updatedAt: new Date(),
      })
      .where(eq(schema.assignment.id, req.params.id));

    await writeAudit(session.profile, 'REASSIGN_ASSIGNMENT', 'assignment', req.params.id, {
      from: assignment.assignedSurveyorName,
      to: surveyorAuthUser.name,
    });

    const updated = await db.query.assignment.findFirst({ where: eq(schema.assignment.id, req.params.id) });
    if (!updated) return res.status(404).json({ error: 'Assignment not found after update' });
    await createNotificationsForRecipients([updated.assignedSurveyorId], {
      type: 'assignment_reassigned',
      severity: updated.priority === 'High' ? 'warning' : 'info',
      title: 'Kunjungan dialihkan ke Anda',
      body: `${updated.storeName} sekarang menjadi tanggung jawab Anda.`,
      entityType: 'assignment',
      entityId: updated.id,
      actionView: 'surveyor',
      metadata: { storeName: updated.storeName, previousSurveyorName: assignment.assignedSurveyorName, visitDate: toIsoString(updated.visitDate) },
    });
    if (assignment.assignedSurveyorId !== updated.assignedSurveyorId) {
      await createNotificationsForRecipients([assignment.assignedSurveyorId], {
        type: 'assignment_reassigned_from_user',
        severity: 'info',
        title: 'Kunjungan dialihkan',
        body: `${updated.storeName} sudah dialihkan ke ${updated.assignedSurveyorName}.`,
        entityType: 'assignment',
        entityId: updated.id,
        actionView: 'surveyor',
        metadata: { storeName: updated.storeName, nextSurveyorName: updated.assignedSurveyorName },
      });
    }
    if (updated.assignedManagerId !== session.profile.id) {
      await createNotificationsForRecipients([updated.assignedManagerId], {
        type: 'assignment_reassigned',
        severity: 'info',
        title: 'Assignment diperbarui',
        body: `${updated.storeName} dialihkan dari ${assignment.assignedSurveyorName} ke ${updated.assignedSurveyorName}.`,
        entityType: 'assignment',
        entityId: updated.id,
        actionView: 'assignments',
        metadata: { storeName: updated.storeName, previousSurveyorName: assignment.assignedSurveyorName, nextSurveyorName: updated.assignedSurveyorName },
      });
    }
    return res.json({ assignment: sanitizeAssignment(updated) });
  });

  router.post('/evidence', async (req, res) => {
    const session = await requireRole(req, res, ['Surveyor', 'Administrator']);
    if (!session) return;

    const parsed = evidenceInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid evidence payload' });

    const match = parsed.data.dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return res.status(400).json({ error: 'Evidence must be a camera-captured image data URL' });
    const mimeType = match[1] === 'image/jpg' ? 'image/jpeg' : match[1];
    const dataBase64 = match[2];
    if (Buffer.byteLength(dataBase64, 'base64') > 2_500_000) {
      return res.status(413).json({ error: 'Evidence image is too large after compression' });
    }

    const id = nanoid();
    const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    await db.insert(schema.photoEvidence).values({
      id,
      surveyId: null,
      uploadedBy: session.profile.id,
      photoType: parsed.data.photoType,
      filename: `${id}.${extension}`,
      mimeType,
      dataBase64,
      capturedAt: new Date(),
      createdAt: new Date(),
    });

    return res.status(201).json({ id, url: `/api/evidence/${id}` });
  });

  router.get('/evidence/:id', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;

    const evidence = await db.query.photoEvidence.findFirst({ where: eq(schema.photoEvidence.id, req.params.id) });
    if (!evidence) return res.status(404).json({ error: 'Evidence not found' });
    const survey = evidence.surveyId
      ? await db.query.surveyResult.findFirst({ where: eq(schema.surveyResult.id, evidence.surveyId) })
      : undefined;
    if (!canReadEvidence(session, evidence, survey)) {
      return res.status(403).json({ error: 'Evidence is not accessible for this user' });
    }

    res.setHeader('content-type', evidence.mimeType);
    res.setHeader('cache-control', 'private, max-age=86400');
    return res.send(Buffer.from(evidence.dataBase64, 'base64'));
  });

  router.post('/imports/:kind', async (req, res) => {
    const kind = req.params.kind;
    if (!isImportKind(kind)) return res.status(404).json({ error: 'Import template not found' });
    const allowedRoles: Array<z.infer<typeof roleSchema>> = kind === 'target-store-import' ? ['Manager', 'Administrator'] : ['Administrator'];
    const session = await requireRole(req, res, allowedRoles);
    if (!session) return;

    const parsed = importInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid XLSX import payload' });

    let rows: ImportRow[];
    try {
      rows = rowsFromXlsx(parsed.data.dataBase64, importTemplateHeaders[kind]);
    } catch (error) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'File XLSX tidak valid.' });
    }

    const importResult =
      kind === 'user-import'
        ? await importUsers(rows, session.profile)
        : kind === 'target-store-import'
          ? await importTargetStores(rows, session.profile)
          : kind === 'territory-master'
            ? await importTerritoryMaster(rows, session.profile)
            : { created: 0, skipped: rows.length, errors: [] as string[] };

    if (kind === 'master-survey-options') {
      await writeAudit(session.profile, 'VALIDATE_SURVEY_OPTIONS_IMPORT', 'import', kind, { fileName: parsed.data.fileName, rows: rows.length });
    }

    return res.json({
      result: {
        kind,
        fileName: parsed.data.fileName,
        processedRows: rows.length,
        ...importResult,
      },
    });
  });

  router.get('/locations/provinces', async (_req, res) => {
    return res.json({ provinces: listLocationProvinces(), source: boundaryDataStatus().source });
  });

  router.get('/locations/cities', async (req, res) => {
    const parsed = locationQuerySchema.required({ province: true }).safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Province is required' });

    return res.json({ cities: listLocationCities(parsed.data.province), source: boundaryDataStatus().source });
  });

  router.get('/locations/districts', async (req, res) => {
    const parsed = locationQuerySchema.required({ province: true, city: true }).safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Province and city are required' });

    return res.json({ districts: listLocationDistricts(parsed.data.province, parsed.data.city), source: boundaryDataStatus().source });
  });

  router.get('/locations/villages', async (req, res) => {
    const parsed = locationQuerySchema.required({ province: true, city: true, district: true }).safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Province, city, and district are required' });

    return res.json({
      villages: listLocationVillages(parsed.data.province, parsed.data.city, parsed.data.district),
      source: boundaryDataStatus().source,
    });
  });

  router.get('/locations/reverse', async (req, res) => {
    const parsed = reverseLocationQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Latitude and longitude are required' });

    const status = boundaryDataStatus();
    if (!status.available) {
      return res.json({ match: null, available: false, source: status.source });
    }

    const match = reverseLocation(parsed.data.latitude, parsed.data.longitude, parsed.data.accuracy);
    return res.json({ match, available: true, source: status.source });
  });

  router.post('/locations/validate', async (req, res) => {
    const parsed = locationValidationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ valid: false, error: 'Invalid location payload' });

    return res.json({ valid: locationExists(parsed.data), source: boundaryDataStatus().source });
  });

  router.post('/login', async (req, res) => {
    const body = z
      .object({
        username: z.string().trim().min(1),
        password: z.string().min(1),
      })
      .safeParse(req.body);

    if (!body.success) return res.status(400).json({ error: 'Invalid login payload' });

    const identifier = body.data.username.toLowerCase();
    const profile = await db.query.userProfile.findFirst({
      where:
        identifier.includes('@') || identifier.startsWith('08')
          ? eq(schema.userProfile.phone, identifier)
          : eq(schema.userProfile.username, identifier),
    });

    if (!profile) return res.status(401).json({ error: 'Invalid username or password' });
    if (profile.status !== 'Active') return res.status(403).json({ error: 'User is inactive' });

    const authUser = await db.query.user.findFirst({
      where: eq(schema.user.id, profile.authUserId),
    });
    if (!authUser) return res.status(401).json({ error: 'Invalid username or password' });

    const authResponse = await auth.handler(
      new Request('http://127.0.0.1:3005/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: authUser.email,
          password: body.data.password,
        }),
      }),
    );

    if (!authResponse.ok) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return copyBetterAuthResponse(authResponse, res, {
      user: sanitizeUser(profile, authUser),
    });
  });

  router.post('/logout', async (req, res) => {
    const authResponse = await auth.handler(
      new Request('http://127.0.0.1:3005/api/auth/sign-out', {
        method: 'POST',
        headers: {
          cookie: req.headers.cookie ?? '',
        },
      }),
    );
    return copyBetterAuthResponse(authResponse, res, { ok: true });
  });

  router.get('/session', async (req, res) => {
    const session = await getSessionFromRequest(req);
    return res.json({ user: session?.user ?? null });
  });

  router.get('/surveys/mine', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;
    const parsed = surveyListQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid survey list query' });

    const where = visibleSurveyWhere(session.profile, parsed.data.cursor);

    const surveys = where
      ? await db.query.surveyResult.findMany({
          where,
          orderBy: desc(schema.surveyResult.submitTime),
          limit: Math.min(parsed.data.limit, 100),
        })
      : await db.query.surveyResult.findMany({
          orderBy: desc(schema.surveyResult.submitTime),
          limit: Math.min(parsed.data.limit, 100),
        });

    const duplicateMeta = duplicateMetaForRows(surveys, await visibleVerifiedDuplicateTargets(session.profile));
    return res.json({ surveys: surveys.map((row) => sanitizeSurvey(row, duplicateMeta.get(row.id))) });
  });

  router.get('/surveys', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;
    const parsed = surveyListQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid survey list query' });

    const where = visibleSurveyWhere(session.profile, parsed.data.cursor);

    const surveys = where
      ? await db.query.surveyResult.findMany({
          where,
          orderBy: desc(schema.surveyResult.submitTime),
          limit: parsed.data.limit,
        })
      : await db.query.surveyResult.findMany({
          orderBy: desc(schema.surveyResult.submitTime),
          limit: parsed.data.limit,
        });

    const duplicateMeta = duplicateMetaForRows(surveys, await visibleVerifiedDuplicateTargets(session.profile));
    return res.json({ surveys: surveys.map((row) => sanitizeSurveyListItem(row, duplicateMeta.get(row.id))) });
  });

  router.get('/surveys/:id/duplicate-candidates', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;
    const parsed = duplicateCandidateQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid duplicate candidate query' });

    const survey = await db.query.surveyResult.findFirst({ where: eq(schema.surveyResult.id, req.params.id) });
    if (!survey) return res.status(404).json({ error: 'Survey not found' });
    if (!canReadSurvey(session.profile, survey)) return res.status(403).json({ error: 'Survey is not accessible for this user' });

    const verifiedRows = await visibleVerifiedDuplicateTargets(session.profile);
    const contextRows = mergeSurveyRowsById([survey, ...verifiedRows]);
    const candidates = topDuplicateCandidates(contextRows, survey, parsed.data.search, parsed.data.limit)
      .filter(({ score }) => score >= parsed.data.minScore)
      .map(({ row, score }) => ({
        row: sanitizeSurveyListItem(row),
        score,
      }));

    return res.json({ candidates });
  });

  router.get('/surveys/:id', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;

    const survey = await db.query.surveyResult.findFirst({ where: eq(schema.surveyResult.id, req.params.id) });
    if (!survey) return res.status(404).json({ error: 'Survey not found' });
    if (!canReadSurvey(session.profile, survey)) return res.status(403).json({ error: 'Survey is not accessible for this user' });

    const duplicateMeta = duplicateMetaForRows([survey], await visibleVerifiedDuplicateTargets(session.profile));
    return res.json({ survey: sanitizeSurvey(survey, duplicateMeta.get(survey.id)) });
  });

  router.post('/surveys', async (req, res) => {
    const session = await requireSession(req, res);
    if (!session) return;
    if (!['Surveyor', 'Administrator'].includes(session.profile.role)) {
      return res.status(403).json({ error: 'Only Surveyor or Administrator can submit survey data' });
    }

    const parsed = surveyInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid survey payload' });
    const input = parsed.data;
    const submittedCoordinateError = requiredCoordinateError(input.latitude, input.longitude);
    if (submittedCoordinateError) return res.status(400).json({ error: submittedCoordinateError });

    let assignmentRow: typeof schema.assignment.$inferSelect | undefined;
    if (input.assignmentId) {
      assignmentRow = await db.query.assignment.findFirst({ where: eq(schema.assignment.id, input.assignmentId) });
      if (!assignmentRow) return res.status(400).json({ error: 'Assignment not found' });
      if (session.profile.role === 'Surveyor' && assignmentRow.assignedSurveyorId !== session.profile.id) {
        return res.status(403).json({ error: 'Surveyor can only submit assigned store data' });
      }
    }

    const existingAssignmentSurvey = input.assignmentId
      ? await db.query.surveyResult.findFirst({
          where: eq(schema.surveyResult.assignmentId, input.assignmentId),
          orderBy: desc(schema.surveyResult.submitTime),
        })
      : undefined;
    if (existingAssignmentSurvey && existingAssignmentSurvey.verificationStatus !== 'NEED_REVISION') {
      return res.status(409).json({ error: 'Survey untuk assignment ini sudah tersubmit dan tidak bisa dikirim ulang.' });
    }

    if (!locationExists({ province: input.province, city: input.city, district: input.district, village: input.village })) {
      return res.status(400).json({ error: 'Location does not exist in master location data' });
    }

    const isCompleted = isCompletedVisitOutcome(input.visitOutcome);
    if (isCompleted && !input.whatsappNumber && !input.waEmptyReason) {
      return res.status(400).json({ error: 'WA empty reason is required when WhatsApp number is empty' });
    }
    if (isCompleted && !input.storefrontPhotoUrl) {
      return res.status(400).json({ error: 'Storefront photo is required for completed survey' });
    }
    if (isCompleted && !input.interiorPhotoUrl && !input.photoMissingReason) {
      return res.status(400).json({ error: 'Photo missing reason is required when evidence photo is missing' });
    }
    if (isCompleted && !input.picPhotoUrl && !input.photoMissingReason) {
      return res.status(400).json({ error: 'PIC photo missing reason is required when PIC photo is missing' });
    }
    const evidenceUrlError = await validateEvidenceUrlsForSubmit(session, [input.storefrontPhotoUrl, input.interiorPhotoUrl, input.picPhotoUrl]);
    if (evidenceUrlError) return res.status(evidenceUrlError.status).json({ error: evidenceUrlError.error });

    const gpsDistanceFromTarget = assignmentRow
      ? distanceMetersBetween(input.latitude, input.longitude, assignmentRow.latitude, assignmentRow.longitude)
      : 0;
    const gpsWarningFlag = gpsDistanceFromTarget > 100;

    const warningFlags = [
      gpsWarningFlag ? 'GPS_WARNING_GT_100M' : null,
      !isCompleted ? 'VISIT_NOT_COMPLETED' : null,
      isCompleted && !input.whatsappNumber ? 'WA_EMPTY_WITH_REASON' : null,
      isCompleted && !input.interiorPhotoUrl ? 'MISSING_INTERIOR_PHOTO' : null,
      isCompleted && !input.picPhotoUrl ? 'MISSING_PIC_PHOTO' : null,
      input.storeName.length < 4 ? 'STORE_NAME_TOO_SHORT' : null,
    ].filter(Boolean) as string[];

    const score = scoreSurvey(input, warningFlags);
    const now = new Date();
    const visitStartTime = new Date(now.getTime() - 14 * 60_000);
    const storeCode = `KLWT-SV-${Date.now().toString(36).toUpperCase()}-${nanoid(4).toUpperCase()}`;

    const managerProfile = session.profile.managerId
      ? await db.query.userProfile.findFirst({ where: eq(schema.userProfile.id, session.profile.managerId) })
      : null;
    const managerAuthUser = managerProfile
      ? await db.query.user.findFirst({ where: eq(schema.user.id, managerProfile.authUserId) })
      : null;

    const row: typeof schema.surveyResult.$inferInsert = {
      id: existingAssignmentSurvey?.id ?? nanoid(),
      assignmentId: input.assignmentId || null,
      storeCode: existingAssignmentSurvey?.storeCode ?? storeCode,
      candidateStoreStatus: 'CANDIDATE_STORE',
      storeName: input.storeName,
      storeAlias: input.storeAlias || null,
      visitOutcome: input.visitOutcome,
      plannedOrUnplanned: input.plannedOrUnplanned,
      province: input.province,
      city: input.city,
      district: input.district,
      village: input.village,
      addressDetail: input.addressDetail,
      landmark: input.landmark,
      latitude: input.latitude,
      longitude: input.longitude,
      gpsAccuracy: input.gpsAccuracy,
      gpsWarningFlag,
      gpsDistanceFromTarget,
      contactPersonName: input.contactPersonName || 'Tidak disebutkan',
      picType: input.picType,
      whatsappNumber: input.whatsappNumber || null,
      waEmptyReason: input.whatsappNumber ? null : input.waEmptyReason || null,
      purchasingDecisionMaker: input.purchasingDecisionMaker,
      decisionMakerAvailability: input.decisionMakerAvailability,
      businessType: input.businessType,
      vehicleSpecialization: json(input.vehicleSpecialization),
      storeScale: input.storeScale,
      coolingProducts: json(input.coolingProducts),
      coolingShelfSize: input.coolingShelfSize,
      coolingSalesActivity: input.coolingSalesActivity,
      coolingBrands: json(input.coolingBrands),
      productSellingSegment: input.productSellingSegment,
      lowCostImportShare: input.lowCostImportShare,
      supplierType: json(input.supplierType),
      supplierName: input.supplierName || 'Tidak disebutkan',
      supplierDependency: input.supplierDependency,
      supplierSatisfaction: input.supplierSatisfaction,
      returnEase: input.returnEase,
      deliverySpeed: input.deliverySpeed,
      paymentMethod: input.paymentMethod,
      restockFrequency: input.restockFrequency,
      purchaseSizeRange: input.purchaseSizeRange,
      monthlyPurchaseValue: input.monthlyPurchaseValue,
      marginExpectation: input.marginExpectation,
      currentOrderMethod: json(input.currentOrderMethod),
      mainPurchaseDriver: json(input.mainPurchaseDriver),
      priceSensitivity: input.priceSensitivity,
      opennessToNewSupplier: input.opennessToNewSupplier,
      reasonToTryNewSupplier: json(input.reasonToTryNewSupplier),
      willingnessToReceiveFollowUp: input.willingnessToReceiveFollowUp,
      storefrontPhotoUrl: input.storefrontPhotoUrl || '',
      interiorPhotoUrl: input.interiorPhotoUrl || '',
      picPhotoUrl: input.picPhotoUrl || '',
      photoMissingReason: input.photoMissingReason || null,
      surveyorNotes: input.surveyorNotes || '-',
      warningFlags: json(warningFlags),
      merchantPotentialScore: score.merchantPotentialScore,
      merchantGrade: score.merchantGrade,
      dataQualityScore: score.dataQualityScore,
      dataQualityGrade: score.dataQualityGrade,
      leadClassification: score.leadClassification,
      verificationStatus: warningFlags.length ? 'WAITING_VERIFICATION_WARNING' : 'WAITING_VERIFICATION',
      verifierPhoneCallable: null,
      verifierWhatsappReachable: null,
      verifierContactCheckedAt: null,
      revisionRequest: null,
      surveyorId: session.profile.id,
      surveyorName: session.user.name,
      managerId: managerProfile?.id ?? session.profile.managerId ?? session.profile.id,
      managerName: managerAuthUser?.name ?? 'Polibeli Manager',
      visitDate: now,
      visitStartTime,
      submitTime: now,
      verifiedAt: null,
      createdAt: existingAssignmentSurvey?.createdAt ?? now,
      updatedAt: now,
    };

    if (existingAssignmentSurvey) {
      await db
        .update(schema.surveyResult)
        .set({
          assignmentId: row.assignmentId,
          candidateStoreStatus: row.candidateStoreStatus,
          storeName: row.storeName,
          storeAlias: row.storeAlias,
          visitOutcome: row.visitOutcome,
          plannedOrUnplanned: row.plannedOrUnplanned,
          province: row.province,
          city: row.city,
          district: row.district,
          village: row.village,
          addressDetail: row.addressDetail,
          landmark: row.landmark,
          latitude: row.latitude,
          longitude: row.longitude,
          gpsAccuracy: row.gpsAccuracy,
          gpsWarningFlag: row.gpsWarningFlag,
          gpsDistanceFromTarget: row.gpsDistanceFromTarget,
          contactPersonName: row.contactPersonName,
          picType: row.picType,
          whatsappNumber: row.whatsappNumber,
          waEmptyReason: row.waEmptyReason,
          purchasingDecisionMaker: row.purchasingDecisionMaker,
          decisionMakerAvailability: row.decisionMakerAvailability,
          businessType: row.businessType,
          vehicleSpecialization: row.vehicleSpecialization,
          storeScale: row.storeScale,
          coolingProducts: row.coolingProducts,
          coolingShelfSize: row.coolingShelfSize,
          coolingSalesActivity: row.coolingSalesActivity,
          coolingBrands: row.coolingBrands,
          productSellingSegment: row.productSellingSegment,
          lowCostImportShare: row.lowCostImportShare,
          supplierType: row.supplierType,
          supplierName: row.supplierName,
          supplierDependency: row.supplierDependency,
          supplierSatisfaction: row.supplierSatisfaction,
          returnEase: row.returnEase,
          deliverySpeed: row.deliverySpeed,
          paymentMethod: row.paymentMethod,
          restockFrequency: row.restockFrequency,
          purchaseSizeRange: row.purchaseSizeRange,
          monthlyPurchaseValue: row.monthlyPurchaseValue,
          marginExpectation: row.marginExpectation,
          currentOrderMethod: row.currentOrderMethod,
          mainPurchaseDriver: row.mainPurchaseDriver,
          priceSensitivity: row.priceSensitivity,
          opennessToNewSupplier: row.opennessToNewSupplier,
          reasonToTryNewSupplier: row.reasonToTryNewSupplier,
          willingnessToReceiveFollowUp: row.willingnessToReceiveFollowUp,
          storefrontPhotoUrl: row.storefrontPhotoUrl,
          interiorPhotoUrl: row.interiorPhotoUrl,
          picPhotoUrl: row.picPhotoUrl,
          photoMissingReason: row.photoMissingReason,
          surveyorNotes: row.surveyorNotes,
          warningFlags: row.warningFlags,
          merchantPotentialScore: row.merchantPotentialScore,
          merchantGrade: row.merchantGrade,
          dataQualityScore: row.dataQualityScore,
          dataQualityGrade: row.dataQualityGrade,
          leadClassification: row.leadClassification,
          verificationStatus: row.verificationStatus,
          verificatorId: null,
          verificationNotes: null,
          revisionRequest: null,
          verifierPhoneCallable: null,
          verifierWhatsappReachable: null,
          verifierContactCheckedAt: null,
          surveyorId: row.surveyorId,
          surveyorName: row.surveyorName,
          managerId: row.managerId,
          managerName: row.managerName,
          visitDate: row.visitDate,
          visitStartTime: row.visitStartTime,
          submitTime: row.submitTime,
          verifiedAt: null,
          updatedAt: now,
        })
        .where(eq(schema.surveyResult.id, existingAssignmentSurvey.id));
    } else {
      await db.insert(schema.surveyResult).values(row);
    }
    if (assignmentRow) {
      await db
        .update(schema.assignment)
        .set({
          status: 'SUBMITTED',
          updatedAt: now,
        })
        .where(eq(schema.assignment.id, assignmentRow.id));
      await writeAudit(session.profile, existingAssignmentSurvey ? 'RESUBMIT_REVISION_SURVEY' : 'SUBMIT_ASSIGNMENT_SURVEY', 'assignment', assignmentRow.id, {
        surveyId: row.id,
        storeName: row.storeName,
      });
    }
    await linkSurveyEvidence(row.id, [row.storefrontPhotoUrl, row.interiorPhotoUrl, row.picPhotoUrl]);

    const savedSurvey = await db.query.surveyResult.findFirst({ where: eq(schema.surveyResult.id, row.id) });
    const notificationSurvey = (savedSurvey ?? row) as typeof schema.surveyResult.$inferSelect;
    const surveyNotificationType = existingAssignmentSurvey ? 'survey_revision_resubmitted' : 'survey_submitted';
    await notifyRoles(
      ['Verificator', 'Administrator'],
      {
        type: surveyNotificationType,
        severity: warningFlags.length ? 'warning' : 'info',
        title: existingAssignmentSurvey ? 'Revisi survey dikirim ulang' : 'Survey baru menunggu verifikasi',
        body: `${notificationSurvey.storeName} dikirim oleh ${notificationSurvey.surveyorName}${warningFlags.length ? ` dengan ${warningFlags.length} warning.` : '.'}`,
        entityType: 'surveyResult',
        entityId: notificationSurvey.id,
        actionView: 'verification',
        metadata: {
          storeName: notificationSurvey.storeName,
          surveyorName: notificationSurvey.surveyorName,
          verificationStatus: notificationSurvey.verificationStatus,
          warningFlags,
        },
      },
      [session.profile.id],
    );
    if (notificationSurvey.managerId !== session.profile.id) {
      await createNotificationsForRecipients([notificationSurvey.managerId], {
        type: surveyNotificationType,
        severity: warningFlags.length ? 'warning' : 'info',
        title: existingAssignmentSurvey ? 'Revisi laporan tim terkirim' : 'Laporan survey tim terkirim',
        body: `${notificationSurvey.surveyorName} mengirim laporan ${notificationSurvey.storeName}.`,
        entityType: 'surveyResult',
        entityId: notificationSurvey.id,
        actionView: 'command',
        metadata: {
          storeName: notificationSurvey.storeName,
          surveyorName: notificationSurvey.surveyorName,
          verificationStatus: notificationSurvey.verificationStatus,
        },
      });
    }

    return res.status(existingAssignmentSurvey ? 200 : 201).json({ survey: sanitizeSurvey(notificationSurvey) });
  });

  router.patch('/surveys/:id/verification', async (req, res) => {
    const session = await requireVerificationAccess(req, res);
    if (!session) return;

    const parsed = verificationInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid verification payload' });
    if (parsed.data.status === 'NEED_REVISION' && !parsed.data.revisionRequest) {
      return res.status(400).json({ error: 'Revision request is required for NEED_REVISION' });
    }
    if (parsed.data.status === 'MERGED_DUPLICATE' && !parsed.data.duplicateTargetId) {
      return res.status(400).json({ error: 'Duplicate target is required for MERGED_DUPLICATE' });
    }

    const survey = await db.query.surveyResult.findFirst({
      where: eq(schema.surveyResult.id, req.params.id),
    });
    if (!survey) return res.status(404).json({ error: 'Survey not found' });

    const duplicateTarget = parsed.data.duplicateTargetId
      ? await db.query.surveyResult.findFirst({
          where: eq(schema.surveyResult.id, parsed.data.duplicateTargetId),
        })
      : null;
    if (parsed.data.status === 'MERGED_DUPLICATE' && !duplicateTarget) {
      return res.status(400).json({ error: 'Duplicate target was not found' });
    }
    if (parsed.data.status === 'MERGED_DUPLICATE' && !canMergeDuplicateTarget(duplicateTarget?.verificationStatus)) {
      return res.status(400).json({ error: 'Duplicate target must be a verified valid store' });
    }

    const verificationNotes =
      parsed.data.status === 'MERGED_DUPLICATE'
        ? duplicateVerificationNote({
            targetStoreName: duplicateTarget?.storeName ?? parsed.data.duplicateTargetStoreName,
            targetStoreCode: duplicateTarget?.storeCode,
            fallbackTargetId: parsed.data.duplicateTargetId,
            existingNotes: parsed.data.verificationNotes,
          })
        : parsed.data.verificationNotes || null;

    const candidateStoreStatus =
      parsed.data.status === 'VERIFIED_VALID'
        ? 'VERIFIED_MASTER_STORE'
        : parsed.data.status === 'MERGED_DUPLICATE'
          ? 'MERGED_DUPLICATE'
          : parsed.data.status === 'REJECTED_INVALID'
            ? 'REJECTED_STORE'
            : 'CANDIDATE_STORE';
    const contactCheckProvided = parsed.data.verifierPhoneCallable !== undefined || parsed.data.verifierWhatsappReachable !== undefined;
    const contactAssessment = scoreSurveyWithVerifierContact(survey, {
      verifierPhoneCallable: parsed.data.verifierPhoneCallable,
      verifierWhatsappReachable: parsed.data.verifierWhatsappReachable,
    });

    await db
      .update(schema.surveyResult)
      .set({
        verificationStatus: parsed.data.status,
        candidateStoreStatus,
        verificatorId: session.profile.id,
        verificationNotes,
        revisionRequest: parsed.data.status === 'NEED_REVISION' ? parsed.data.revisionRequest || null : null,
        verifierPhoneCallable: contactAssessment.phoneCallable,
        verifierWhatsappReachable: contactAssessment.whatsappReachable,
        verifierContactCheckedAt: contactCheckProvided || !survey.verifierContactCheckedAt ? new Date() : survey.verifierContactCheckedAt,
        warningFlags: json(contactAssessment.warningFlags),
        merchantPotentialScore: contactAssessment.score.merchantPotentialScore,
        merchantGrade: contactAssessment.score.merchantGrade,
        dataQualityScore: contactAssessment.score.dataQualityScore,
        dataQualityGrade: contactAssessment.score.dataQualityGrade,
        leadClassification: contactAssessment.score.leadClassification,
        verifiedAt: parsed.data.status === 'NEED_REVISION' ? null : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.surveyResult.id, req.params.id));

    const updatedSurvey = await db.query.surveyResult.findFirst({
      where: eq(schema.surveyResult.id, req.params.id),
    });
    if (!updatedSurvey) return res.status(404).json({ error: 'Survey not found after update' });

    const decisionCopy: Record<z.infer<typeof verificationDecisionSchema>, { title: string; body: string; severity: NotificationSeverity }> = {
      VERIFIED_VALID: {
        title: 'Survey terverifikasi valid',
        body: `${updatedSurvey.storeName} sudah diverifikasi valid.`,
        severity: 'success',
      },
      NEED_REVISION: {
        title: 'Survey perlu revisi',
        body: `${updatedSurvey.storeName} dikembalikan untuk revisi: ${updatedSurvey.revisionRequest ?? 'lihat catatan verifikasi.'}`,
        severity: 'warning',
      },
      REJECTED_INVALID: {
        title: 'Survey ditolak',
        body: `${updatedSurvey.storeName} ditolak sebagai data invalid.`,
        severity: 'error',
      },
      MERGED_DUPLICATE: {
        title: 'Survey digabung sebagai duplikat',
        body: `${updatedSurvey.storeName} ditandai sebagai duplikat dari data master.`,
        severity: 'info',
      },
    };
    const decisionNotification = decisionCopy[parsed.data.status];
    await createNotificationsForRecipients([updatedSurvey.surveyorId], {
      type: 'verification_decision',
      severity: decisionNotification.severity,
      title: decisionNotification.title,
      body: decisionNotification.body,
      entityType: 'surveyResult',
      entityId: updatedSurvey.id,
      actionView: parsed.data.status === 'NEED_REVISION' ? 'surveyor' : 'surveyor',
      metadata: {
        storeName: updatedSurvey.storeName,
        verificationStatus: updatedSurvey.verificationStatus,
        revisionRequest: updatedSurvey.revisionRequest,
      },
    });
    if (updatedSurvey.managerId !== updatedSurvey.surveyorId && updatedSurvey.managerId !== session.profile.id) {
      await createNotificationsForRecipients([updatedSurvey.managerId], {
        type: 'verification_decision',
        severity: decisionNotification.severity,
        title: `Keputusan verifikasi: ${updatedSurvey.storeName}`,
        body: `${updatedSurvey.surveyorName}: ${decisionNotification.title}.`,
        entityType: 'surveyResult',
        entityId: updatedSurvey.id,
        actionView: 'command',
        metadata: {
          storeName: updatedSurvey.storeName,
          surveyorName: updatedSurvey.surveyorName,
          verificationStatus: updatedSurvey.verificationStatus,
        },
      });
    }

    return res.json({ survey: sanitizeSurvey(updatedSurvey) });
  });

  router.patch('/surveys/:id/verification/annul', async (req, res) => {
    const session = await requireVerificationAccess(req, res);
    if (!session) return;

    const parsed = verificationAnnulInputSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ error: 'Invalid verification annul payload' });

    const survey = await db.query.surveyResult.findFirst({
      where: eq(schema.surveyResult.id, req.params.id),
    });
    if (!survey) return res.status(404).json({ error: 'Survey not found' });
    if (!canReadSurvey(session.profile, survey)) return res.status(403).json({ error: 'Survey is not accessible for this user' });
    if (!isVerificationHistoryRow(survey)) {
      return res.status(409).json({ error: 'Survey ini belum memiliki keputusan verifikasi yang bisa dianulir.' });
    }

    const baseWarningFlags = parseJsonArray(survey.warningFlags).filter((flag) => !flag.startsWith('VERIFIER_'));
    const baseContactRow = {
      ...survey,
      verifierPhoneCallable: null,
      verifierWhatsappReachable: null,
    };
    const basePhoneCallable = effectiveVerifierPhoneCallable(baseContactRow);
    const baseWhatsappReachable = effectiveVerifierWhatsappReachable(baseContactRow);
    const baseScore = scoreSurvey(surveyScoreInputFromRow(baseContactRow, basePhoneCallable, baseWhatsappReachable), baseWarningFlags);
    const nextVerificationStatus = baseWarningFlags.length ? 'WAITING_VERIFICATION_WARNING' : 'WAITING_VERIFICATION';
    const previousStatus = survey.verificationStatus;
    const annulReason = parsed.data.reason || null;

    await db
      .update(schema.surveyResult)
      .set({
        verificationStatus: nextVerificationStatus,
        candidateStoreStatus: 'CANDIDATE_STORE',
        verificatorId: null,
        verificationNotes: null,
        revisionRequest: null,
        verifierPhoneCallable: null,
        verifierWhatsappReachable: null,
        verifierContactCheckedAt: null,
        warningFlags: json(baseWarningFlags),
        merchantPotentialScore: baseScore.merchantPotentialScore,
        merchantGrade: baseScore.merchantGrade,
        dataQualityScore: baseScore.dataQualityScore,
        dataQualityGrade: baseScore.dataQualityGrade,
        leadClassification: baseScore.leadClassification,
        verifiedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.surveyResult.id, req.params.id));

    const updatedSurvey = await db.query.surveyResult.findFirst({
      where: eq(schema.surveyResult.id, req.params.id),
    });
    if (!updatedSurvey) return res.status(404).json({ error: 'Survey not found after annul' });

    await writeAudit(session.profile, 'ANNUL_VERIFICATION_DECISION', 'surveyResult', updatedSurvey.id, {
      storeName: updatedSurvey.storeName,
      previousStatus,
      nextStatus: nextVerificationStatus,
      reason: annulReason,
    });

    await createNotificationsForRecipients([updatedSurvey.surveyorId], {
      type: 'verification_annulled',
      severity: 'info',
      title: 'Status verifikasi dianulir',
      body: `${updatedSurvey.storeName} dikembalikan ke antrean verifikasi untuk direview ulang.`,
      entityType: 'surveyResult',
      entityId: updatedSurvey.id,
      actionView: 'surveyor',
      metadata: {
        storeName: updatedSurvey.storeName,
        previousStatus,
        verificationStatus: updatedSurvey.verificationStatus,
        reason: annulReason,
      },
    });
    if (updatedSurvey.managerId !== updatedSurvey.surveyorId && updatedSurvey.managerId !== session.profile.id) {
      await createNotificationsForRecipients([updatedSurvey.managerId], {
        type: 'verification_annulled',
        severity: 'info',
        title: `Status verifikasi dianulir: ${updatedSurvey.storeName}`,
        body: `${updatedSurvey.surveyorName}: data kembali ke antrean verifikasi.`,
        entityType: 'surveyResult',
        entityId: updatedSurvey.id,
        actionView: 'verification',
        metadata: {
          storeName: updatedSurvey.storeName,
          surveyorName: updatedSurvey.surveyorName,
          previousStatus,
          verificationStatus: updatedSurvey.verificationStatus,
        },
      });
    }

    const duplicateMeta = duplicateMetaForRows([updatedSurvey], await visibleVerifiedDuplicateTargets(session.profile));
    return res.json({ survey: sanitizeSurvey(updatedSurvey, duplicateMeta.get(updatedSurvey.id)) });
  });

  router.get('/exports/:kind', async (req, res) => {
    const session = await requireRole(req, res, ['Head', 'Manager', 'Verificator', 'Administrator']);
    if (!session) return;

    const rows = await visibleSurveyRows(session.profile);
    const kind = req.params.kind;
    const baseRows = rows.map((row) => sanitizeSurvey(row));
    let exportRows: Array<Record<string, unknown>>;

    if (kind === 'verified-store-database') {
      exportRows = baseRows
        .filter((row) => row.verificationStatus === 'VERIFIED_VALID')
        .map((row) => ({
          store_id: row.storeCode,
          store_name: row.storeName,
          province: row.province,
          city_regency: row.city,
          district: row.district,
          village: row.village,
          address_detail: row.addressDetail,
          landmark: row.landmark,
          latitude: row.latitude,
          longitude: row.longitude,
          whatsapp_number: row.whatsappNumber,
          phone_callable_verified: row.verifierPhoneCallable,
          whatsapp_reachable_verified: row.verifierWhatsappReachable,
          contact_checked_at: row.verifierContactCheckedAt,
          business_type: row.businessType,
          merchant_potential_score: row.merchantPotentialScore,
          merchant_grade: row.merchantGrade,
          data_quality_score: row.dataQualityScore,
          data_quality_grade: row.dataQualityGrade,
          lead_classification: row.leadClassification,
          verified_at: row.verifiedAt,
        }));
    } else if (kind === 'hot-qualified-leads') {
      exportRows = baseRows
        .filter((row) => ['Hot Lead', 'Qualified Lead'].includes(row.leadClassification))
        .map((row) => ({
          store_id: row.storeCode,
          store_name: row.storeName,
          province: row.province,
          city_regency: row.city,
          district: row.district,
          village: row.village,
          address_detail: row.addressDetail,
          landmark: row.landmark,
          latitude: row.latitude,
          longitude: row.longitude,
          contact_person_name: row.contactPersonName,
          contact_person_role: row.picType,
          whatsapp_number: row.whatsappNumber,
          phone_callable_verified: row.verifierPhoneCallable,
          whatsapp_reachable_verified: row.verifierWhatsappReachable,
          contact_checked_at: row.verifierContactCheckedAt,
          business_type: row.businessType,
          cooling_products: row.coolingProducts.join(', '),
          merchant_potential_score: row.merchantPotentialScore,
          merchant_grade: row.merchantGrade,
          data_quality_score: row.dataQualityScore,
          data_quality_grade: row.dataQualityGrade,
          lead_classification: row.leadClassification,
          openness_to_new_supplier: row.opennessToNewSupplier,
          main_reason_to_try_new_supplier: row.reasonToTryNewSupplier.join(', '),
          supplier_type: row.supplierType.join(', '),
          supplier_name: row.supplierName,
          brand_seen: row.coolingBrands.join(', '),
          restock_frequency: row.restockFrequency,
          estimated_monthly_purchase_value: row.monthlyPurchaseValue,
          survey_date: row.submitTime,
          surveyor_name: row.surveyorName,
          manager_name: row.managerName,
          photo_front_url: row.storefrontPhotoUrl,
          photo_inside_url: row.interiorPhotoUrl,
          photo_pic_url: row.picPhotoUrl,
          verification_status: row.verificationStatus,
        }));
    } else if (kind === 'supplier-brand-intelligence') {
      exportRows = baseRows.map((row) => ({
        store_id: row.storeCode,
        store_name: row.storeName,
        city: row.city,
        business_type: row.businessType,
        cooling_products: row.coolingProducts.join(', '),
        cooling_brands_seen: row.coolingBrands.join(', '),
        supplier_type: row.supplierType.join(', '),
        supplier_name: row.supplierName,
        supplier_satisfaction: row.supplierSatisfaction,
        phone_callable_verified: row.verifierPhoneCallable,
        whatsapp_reachable_verified: row.verifierWhatsappReachable,
        return_ease: row.returnEase,
        delivery_speed: row.deliverySpeed,
        payment_method: row.paymentMethod,
        low_cost_import_share: row.lowCostImportShare,
        product_selling_segment: row.productSellingSegment,
      }));
    } else if (kind === 'photo-evidence-links') {
      exportRows = baseRows.map((row) => ({
        store_id: row.storeCode,
        store_name: row.storeName,
        surveyor_name: row.surveyorName,
        photo_front_url: row.storefrontPhotoUrl,
        photo_inside_url: row.interiorPhotoUrl,
        photo_pic_url: row.picPhotoUrl,
        missing_reason: row.photoMissingReason,
        verification_status: row.verificationStatus,
      }));
    } else if (kind === 'surveyor-performance') {
      const analyticsRows = Object.entries(
        baseRows.reduce<Record<string, { submitted: number; verified: number; rejected: number; duplicate: number; warning: number; hot: number; qualified: number; merchant: number[]; quality: number[] }>>(
          (counts, row) => {
            counts[row.surveyorName] ??= { submitted: 0, verified: 0, rejected: 0, duplicate: 0, warning: 0, hot: 0, qualified: 0, merchant: [], quality: [] };
            counts[row.surveyorName].submitted += 1;
            counts[row.surveyorName].verified += row.verificationStatus === 'VERIFIED_VALID' ? 1 : 0;
            counts[row.surveyorName].rejected += row.verificationStatus === 'REJECTED_INVALID' ? 1 : 0;
            counts[row.surveyorName].duplicate += row.verificationStatus === 'MERGED_DUPLICATE' ? 1 : 0;
            counts[row.surveyorName].warning += row.warningFlags.length ? 1 : 0;
            counts[row.surveyorName].hot += row.leadClassification === 'Hot Lead' ? 1 : 0;
            counts[row.surveyorName].qualified += row.leadClassification === 'Qualified Lead' ? 1 : 0;
            counts[row.surveyorName].merchant.push(row.merchantPotentialScore);
            counts[row.surveyorName].quality.push(row.dataQualityScore);
            return counts;
          },
          {},
        ),
      );
      exportRows = analyticsRows.map(([surveyor, row]) => ({
        surveyor_name: surveyor,
        submitted_count: row.submitted,
        verified_valid_count: row.verified,
        rejected_count: row.rejected,
        duplicate_count: row.duplicate,
        warning_count: row.warning,
        hot_lead_count: row.hot,
        qualified_lead_count: row.qualified,
        average_merchant_score: average(row.merchant),
        average_data_quality_score: average(row.quality),
        valid_rate: `${percent(row.verified, row.submitted)}%`,
      }));
    } else {
      exportRows = baseRows.map((row) => ({
        store_id: row.storeCode,
        store_name: row.storeName,
        surveyor_name: row.surveyorName,
        manager_name: row.managerName,
        province: row.province,
        city: row.city,
        district: row.district,
        village: row.village,
        visit_outcome: row.visitOutcome,
        planned_or_unplanned: row.plannedOrUnplanned,
        lead_classification: row.leadClassification,
        phone_callable_verified: row.verifierPhoneCallable,
        whatsapp_reachable_verified: row.verifierWhatsappReachable,
        merchant_potential_score: row.merchantPotentialScore,
        merchant_grade: row.merchantGrade,
        data_quality_score: row.dataQualityScore,
        data_quality_grade: row.dataQualityGrade,
        verification_status: row.verificationStatus,
        submit_time: row.submitTime,
      }));
    }

    return res.json({ rows: exportRows });
  });

  router.get('/users', async (req, res) => {
    const session = await requireAdmin(req, res);
    if (!session) return;

    const rows = await db
      .select({
        profile: schema.userProfile,
        authUser: schema.user,
      })
      .from(schema.userProfile)
      .innerJoin(schema.user, eq(schema.userProfile.authUserId, schema.user.id));

    return res.json({
      users: rows.map((row) => sanitizeUser(row.profile, row.authUser)),
    });
  });

  router.post('/users', async (req, res) => {
    const session = await requireAdmin(req, res);
    if (!session) return;

    const parsed = userInputSchema.required({ password: true }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid user payload' });
    if (parsed.data.role === 'Surveyor' && !parsed.data.managerId) {
      return res.status(400).json({ error: 'Surveyor must have a manager' });
    }

    const existingProfile = await db.query.userProfile.findFirst({
      where: eq(schema.userProfile.username, parsed.data.username.toLowerCase()),
    });
    if (existingProfile) return res.status(409).json({ error: 'Username already exists' });

    const authUser = await signUpAuthUser({
      name: parsed.data.name,
      username: parsed.data.username.toLowerCase(),
      password: parsed.data.password,
    });
    if (!authUser) return res.status(500).json({ error: 'Auth user was not created' });

    const now = new Date();
    const profile = {
      id: nanoid(),
      authUserId: authUser.id,
      username: parsed.data.username.toLowerCase(),
      phone: parsed.data.phone,
      role: parsed.data.role,
      managerId: parsed.data.role === 'Surveyor' ? (parsed.data.managerId ?? null) : null,
      area: parsed.data.area ?? (parsed.data.role === 'Surveyor' ? 'Assigned by Manager' : 'Polibeli Office'),
      status: parsed.data.status ?? 'Active',
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(schema.userProfile).values(profile);

    return res.status(201).json({
      user: sanitizeUser(profile, authUser),
    });
  });

  router.put('/users/:id', async (req, res) => {
    const session = await requireAdmin(req, res);
    if (!session) return;

    const parsed = userInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid user payload' });
    if (parsed.data.role === 'Surveyor' && !parsed.data.managerId) {
      return res.status(400).json({ error: 'Surveyor must have a manager' });
    }

    const profile = await db.query.userProfile.findFirst({
      where: eq(schema.userProfile.id, req.params.id),
    });
    if (!profile) return res.status(404).json({ error: 'User not found' });

    const duplicate = await db.query.userProfile.findFirst({
      where: and(eq(schema.userProfile.username, parsed.data.username.toLowerCase()), ne(schema.userProfile.id, req.params.id)),
    });
    if (duplicate) return res.status(409).json({ error: 'Username already exists' });

    const authUser = await db.query.user.findFirst({
      where: eq(schema.user.id, profile.authUserId),
    });
    if (!authUser) return res.status(404).json({ error: 'Auth user not found' });

    await db
      .update(schema.user)
      .set({
        name: parsed.data.name,
        email: emailForUsername(parsed.data.username.toLowerCase()),
        updatedAt: new Date(),
      })
      .where(eq(schema.user.id, profile.authUserId));

    if (parsed.data.password) {
      const passwordHash = await bcrypt.hash(parsed.data.password, 12);
      await db
        .update(schema.account)
        .set({
          password: passwordHash,
          updatedAt: new Date(),
        })
        .where(and(eq(schema.account.userId, profile.authUserId), eq(schema.account.providerId, 'credential')));
    }

    await db
      .update(schema.userProfile)
      .set({
        username: parsed.data.username.toLowerCase(),
        phone: parsed.data.phone,
        role: parsed.data.role,
        managerId: parsed.data.role === 'Surveyor' ? parsed.data.managerId : null,
        area: parsed.data.area ?? profile.area,
        status: parsed.data.status ?? profile.status,
        updatedAt: new Date(),
      })
      .where(eq(schema.userProfile.id, req.params.id));

    const updatedProfile = await db.query.userProfile.findFirst({
      where: eq(schema.userProfile.id, req.params.id),
    });
    const updatedUser = await db.query.user.findFirst({
      where: eq(schema.user.id, profile.authUserId),
    });

    if (!updatedProfile || !updatedUser) return res.status(404).json({ error: 'User not found after update' });
    return res.json({ user: sanitizeUser(updatedProfile, updatedUser) });
  });

  router.patch('/users/:id/status', async (req, res) => {
    const session = await requireAdmin(req, res);
    if (!session) return;

    const parsed = z.object({ status: statusSchema }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid status payload' });

    await db
      .update(schema.userProfile)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(schema.userProfile.id, req.params.id));

    return res.json({ ok: true });
  });

  router.delete('/users/:id', async (req, res) => {
    const session = await requireAdmin(req, res);
    if (!session) return;

    const profile = await db.query.userProfile.findFirst({
      where: eq(schema.userProfile.id, req.params.id),
    });
    if (!profile) return res.status(404).json({ error: 'User not found' });

    await db.delete(schema.user).where(eq(schema.user.id, profile.authUserId));

    return res.json({ ok: true });
  });
}
