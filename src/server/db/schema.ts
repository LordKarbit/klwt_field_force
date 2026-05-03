import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp_ms' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp_ms' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp_ms' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }),
});

export const userProfile = sqliteTable('userProfile', {
  id: text('id').primaryKey(),
  authUserId: text('authUserId')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  username: text('username').notNull().unique(),
  phone: text('phone').notNull().unique(),
  role: text('role', {
    enum: ['Head', 'Manager', 'Surveyor', 'Verificator', 'Administrator'],
  }).notNull(),
  managerId: text('managerId'),
  area: text('area').notNull().default('Unassigned'),
  status: text('status', { enum: ['Active', 'Inactive'] }).notNull().default('Active'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export const location = sqliteTable('location', {
  id: text('id').primaryKey(),
  province: text('province').notNull(),
  city: text('city').notNull(),
  district: text('district').notNull(),
  village: text('village').notNull(),
});

export const assignment = sqliteTable('assignment', {
  id: text('id').primaryKey(),
  storeName: text('storeName').notNull(),
  province: text('province').notNull(),
  city: text('city').notNull(),
  district: text('district').notNull(),
  village: text('village').notNull(),
  addressDetail: text('addressDetail').notNull(),
  landmark: text('landmark').notNull(),
  latitude: text('latitude'),
  longitude: text('longitude'),
  assignedManagerId: text('assignedManagerId').notNull(),
  assignedManagerName: text('assignedManagerName').notNull(),
  assignedSurveyorId: text('assignedSurveyorId').notNull(),
  assignedSurveyorName: text('assignedSurveyorName').notNull(),
  visitDate: integer('visitDate', { mode: 'timestamp_ms' }).notNull(),
  priority: text('priority').notNull(),
  visitObjective: text('visitObjective').notNull(),
  plannedOrUnplanned: text('plannedOrUnplanned').notNull().default('PLANNED'),
  status: text('status').notNull(),
  notes: text('notes'),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export const surveyResult = sqliteTable('surveyResult', {
  id: text('id').primaryKey(),
  assignmentId: text('assignmentId'),
  storeCode: text('storeCode').notNull().unique(),
  candidateStoreStatus: text('candidateStoreStatus').notNull(),
  storeName: text('storeName').notNull(),
  storeAlias: text('storeAlias'),
  visitOutcome: text('visitOutcome').notNull(),
  plannedOrUnplanned: text('plannedOrUnplanned').notNull(),
  province: text('province').notNull(),
  city: text('city').notNull(),
  district: text('district').notNull(),
  village: text('village').notNull(),
  addressDetail: text('addressDetail').notNull(),
  landmark: text('landmark').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  gpsAccuracy: integer('gpsAccuracy').notNull(),
  gpsWarningFlag: integer('gpsWarningFlag', { mode: 'boolean' }).notNull(),
  gpsDistanceFromTarget: integer('gpsDistanceFromTarget').notNull(),
  contactPersonName: text('contactPersonName').notNull(),
  picType: text('picType').notNull(),
  whatsappNumber: text('whatsappNumber'),
  waEmptyReason: text('waEmptyReason'),
  purchasingDecisionMaker: text('purchasingDecisionMaker').notNull(),
  decisionMakerAvailability: text('decisionMakerAvailability').notNull(),
  businessType: text('businessType').notNull(),
  vehicleSpecialization: text('vehicleSpecialization').notNull(),
  storeScale: text('storeScale').notNull(),
  coolingProducts: text('coolingProducts').notNull(),
  coolingShelfSize: text('coolingShelfSize').notNull(),
  coolingSalesActivity: text('coolingSalesActivity').notNull(),
  coolingBrands: text('coolingBrands').notNull(),
  productSellingSegment: text('productSellingSegment').notNull(),
  lowCostImportShare: text('lowCostImportShare').notNull(),
  supplierType: text('supplierType').notNull(),
  supplierName: text('supplierName').notNull(),
  supplierDependency: text('supplierDependency').notNull(),
  supplierSatisfaction: text('supplierSatisfaction').notNull(),
  returnEase: text('returnEase').notNull(),
  deliverySpeed: text('deliverySpeed').notNull(),
  paymentMethod: text('paymentMethod').notNull(),
  restockFrequency: text('restockFrequency').notNull(),
  purchaseSizeRange: text('purchaseSizeRange').notNull(),
  monthlyPurchaseValue: text('monthlyPurchaseValue').notNull(),
  marginExpectation: text('marginExpectation').notNull(),
  currentOrderMethod: text('currentOrderMethod').notNull(),
  mainPurchaseDriver: text('mainPurchaseDriver').notNull(),
  priceSensitivity: text('priceSensitivity').notNull(),
  opennessToNewSupplier: text('opennessToNewSupplier').notNull(),
  reasonToTryNewSupplier: text('reasonToTryNewSupplier').notNull(),
  willingnessToReceiveFollowUp: text('willingnessToReceiveFollowUp').notNull(),
  storefrontPhotoUrl: text('storefrontPhotoUrl').notNull(),
  interiorPhotoUrl: text('interiorPhotoUrl').notNull(),
  picPhotoUrl: text('picPhotoUrl').notNull(),
  photoMissingReason: text('photoMissingReason'),
  surveyorNotes: text('surveyorNotes').notNull(),
  warningFlags: text('warningFlags').notNull(),
  merchantPotentialScore: integer('merchantPotentialScore').notNull(),
  merchantGrade: text('merchantGrade').notNull(),
  dataQualityScore: integer('dataQualityScore').notNull(),
  dataQualityGrade: text('dataQualityGrade').notNull(),
  leadClassification: text('leadClassification').notNull(),
  verificationStatus: text('verificationStatus').notNull(),
  verificatorId: text('verificatorId'),
  verificationNotes: text('verificationNotes'),
  revisionRequest: text('revisionRequest'),
  verifierPhoneCallable: integer('verifierPhoneCallable', { mode: 'boolean' }),
  verifierWhatsappReachable: integer('verifierWhatsappReachable', { mode: 'boolean' }),
  verifierContactCheckedAt: integer('verifierContactCheckedAt', { mode: 'timestamp_ms' }),
  surveyorId: text('surveyorId').notNull(),
  surveyorName: text('surveyorName').notNull(),
  managerId: text('managerId').notNull(),
  managerName: text('managerName').notNull(),
  visitDate: integer('visitDate', { mode: 'timestamp_ms' }).notNull(),
  visitStartTime: integer('visitStartTime', { mode: 'timestamp_ms' }).notNull(),
  submitTime: integer('submitTime', { mode: 'timestamp_ms' }).notNull(),
  verifiedAt: integer('verifiedAt', { mode: 'timestamp_ms' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export const photoEvidence = sqliteTable('photoEvidence', {
  id: text('id').primaryKey(),
  surveyId: text('surveyId'),
  uploadedBy: text('uploadedBy').notNull(),
  photoType: text('photoType').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mimeType').notNull(),
  dataBase64: text('dataBase64').notNull(),
  capturedAt: integer('capturedAt', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
});

export const exportJob = sqliteTable('exportJob', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  kind: text('kind').notNull(),
  scope: text('scope').notNull(),
  status: text('status').notNull(),
  ownerRole: text('ownerRole').notNull(),
  rowCount: integer('rowCount').notNull().default(0),
  createdBy: text('createdBy').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  completedAt: integer('completedAt', { mode: 'timestamp_ms' }),
});

export const auditLog = sqliteTable('auditLog', {
  id: text('id').primaryKey(),
  actorId: text('actorId').notNull(),
  actorRole: text('actorRole').notNull(),
  action: text('action').notNull(),
  entityType: text('entityType').notNull(),
  entityId: text('entityId').notNull(),
  details: text('details').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
});

export const notification = sqliteTable('notification', {
  id: text('id').primaryKey(),
  recipientUserId: text('recipientUserId').notNull(),
  type: text('type').notNull(),
  severity: text('severity').notNull().default('info'),
  title: text('title').notNull(),
  body: text('body').notNull(),
  entityType: text('entityType').notNull(),
  entityId: text('entityId').notNull(),
  actionView: text('actionView').notNull(),
  metadata: text('metadata').notNull().default('{}'),
  readAt: integer('readAt', { mode: 'timestamp_ms' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
});

export const pushSubscription = sqliteTable('pushSubscription', {
  id: text('id').primaryKey(),
  recipientUserId: text('recipientUserId').notNull(),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  expirationTime: integer('expirationTime', { mode: 'timestamp_ms' }),
  userAgent: text('userAgent'),
  lastPushAt: integer('lastPushAt', { mode: 'timestamp_ms' }),
  lastErrorAt: integer('lastErrorAt', { mode: 'timestamp_ms' }),
  lastError: text('lastError'),
  revokedAt: integer('revokedAt', { mode: 'timestamp_ms' }),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
});

export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
