import { rawDb } from './index';

function ensureColumn(tableName: string, columnName: string, definition: string) {
  const columns = rawDb.prepare(`PRAGMA table_info("${tableName}")`).all() as Array<{ name: string }>;
  if (!columns.some((column) => column.name === columnName)) {
    rawDb.exec(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${definition}`);
  }
}

function columnExists(tableName: string, columnName: string) {
  const columns = rawDb.prepare(`PRAGMA table_info("${tableName}")`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
}

export function migrate() {
  rawDb.exec(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "emailVerified" INTEGER NOT NULL DEFAULT 0,
      "image" TEXT,
      "createdAt" INTEGER NOT NULL,
      "updatedAt" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "session" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "expiresAt" INTEGER NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "createdAt" INTEGER NOT NULL,
      "updatedAt" INTEGER NOT NULL,
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "account" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" INTEGER,
      "refreshTokenExpiresAt" INTEGER,
      "scope" TEXT,
      "password" TEXT,
      "createdAt" INTEGER NOT NULL,
      "updatedAt" INTEGER NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "verification" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "identifier" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expiresAt" INTEGER NOT NULL,
      "createdAt" INTEGER,
      "updatedAt" INTEGER
    );

    CREATE TABLE IF NOT EXISTS "userProfile" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "authUserId" TEXT NOT NULL UNIQUE,
      "username" TEXT NOT NULL UNIQUE,
      "phone" TEXT NOT NULL UNIQUE,
      "role" TEXT NOT NULL,
      "managerId" TEXT,
      "area" TEXT NOT NULL DEFAULT 'Unassigned',
      "status" TEXT NOT NULL DEFAULT 'Active',
      "createdAt" INTEGER NOT NULL,
      "updatedAt" INTEGER NOT NULL,
      FOREIGN KEY ("authUserId") REFERENCES "user"("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "location" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "province" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "district" TEXT NOT NULL,
      "village" TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "locationBoundary" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "province" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "district" TEXT NOT NULL,
      "village" TEXT NOT NULL,
      "code" TEXT,
      "minLat" REAL NOT NULL,
      "minLng" REAL NOT NULL,
      "maxLat" REAL NOT NULL,
      "maxLng" REAL NOT NULL,
      "rings" TEXT NOT NULL,
      "pointCount" INTEGER NOT NULL,
      "source" TEXT NOT NULL DEFAULT 'kml',
      "createdAt" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "assignment" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "storeName" TEXT NOT NULL,
      "province" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "district" TEXT NOT NULL,
      "village" TEXT NOT NULL,
      "addressDetail" TEXT NOT NULL,
      "landmark" TEXT NOT NULL,
      "latitude" TEXT,
      "longitude" TEXT,
      "assignedManagerId" TEXT NOT NULL,
      "assignedManagerName" TEXT NOT NULL,
      "assignedSurveyorId" TEXT NOT NULL,
      "assignedSurveyorName" TEXT NOT NULL,
      "visitDate" INTEGER NOT NULL,
      "priority" TEXT NOT NULL,
      "visitObjective" TEXT NOT NULL,
      "plannedOrUnplanned" TEXT NOT NULL DEFAULT 'PLANNED',
      "status" TEXT NOT NULL,
      "notes" TEXT,
      "createdAt" INTEGER NOT NULL,
      "updatedAt" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "surveyResult" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "assignmentId" TEXT,
      "storeCode" TEXT NOT NULL UNIQUE,
      "candidateStoreStatus" TEXT NOT NULL,
      "storeName" TEXT NOT NULL,
      "storeAlias" TEXT,
      "visitOutcome" TEXT NOT NULL,
      "plannedOrUnplanned" TEXT NOT NULL,
      "province" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "district" TEXT NOT NULL,
      "village" TEXT NOT NULL,
      "addressDetail" TEXT NOT NULL,
      "landmark" TEXT NOT NULL,
      "latitude" TEXT NOT NULL,
      "longitude" TEXT NOT NULL,
      "gpsAccuracy" INTEGER NOT NULL,
      "gpsWarningFlag" INTEGER NOT NULL,
      "gpsDistanceFromTarget" INTEGER NOT NULL,
      "contactPersonName" TEXT NOT NULL,
      "picType" TEXT NOT NULL,
      "whatsappNumber" TEXT,
      "waEmptyReason" TEXT,
      "purchasingDecisionMaker" TEXT NOT NULL,
      "decisionMakerAvailability" TEXT NOT NULL,
      "businessType" TEXT NOT NULL,
      "vehicleSpecialization" TEXT NOT NULL,
      "storeScale" TEXT NOT NULL,
      "coolingProducts" TEXT NOT NULL,
      "coolingShelfSize" TEXT NOT NULL,
      "coolingSalesActivity" TEXT NOT NULL,
      "coolingBrands" TEXT NOT NULL,
      "productSellingSegment" TEXT NOT NULL,
      "lowCostImportShare" TEXT NOT NULL,
      "supplierType" TEXT NOT NULL,
      "supplierName" TEXT NOT NULL,
      "supplierDependency" TEXT NOT NULL,
      "supplierSatisfaction" TEXT NOT NULL,
      "returnEase" TEXT NOT NULL,
      "deliverySpeed" TEXT NOT NULL,
      "paymentMethod" TEXT NOT NULL,
      "restockFrequency" TEXT NOT NULL,
      "purchaseSizeRange" TEXT NOT NULL,
      "monthlyPurchaseValue" TEXT NOT NULL,
      "marginExpectation" TEXT NOT NULL,
      "currentOrderMethod" TEXT NOT NULL,
      "mainPurchaseDriver" TEXT NOT NULL,
      "priceSensitivity" TEXT NOT NULL,
      "opennessToNewSupplier" TEXT NOT NULL,
      "reasonToTryNewSupplier" TEXT NOT NULL,
      "willingnessToReceiveFollowUp" TEXT NOT NULL,
      "storefrontPhotoUrl" TEXT NOT NULL,
      "interiorPhotoUrl" TEXT NOT NULL,
      "picPhotoUrl" TEXT NOT NULL,
      "photoMissingReason" TEXT,
      "surveyorNotes" TEXT NOT NULL,
      "warningFlags" TEXT NOT NULL,
      "merchantPotentialScore" INTEGER NOT NULL,
      "merchantGrade" TEXT NOT NULL,
      "dataQualityScore" INTEGER NOT NULL,
      "dataQualityGrade" TEXT NOT NULL,
      "leadClassification" TEXT NOT NULL,
      "verificationStatus" TEXT NOT NULL,
      "verificatorId" TEXT,
      "verificationNotes" TEXT,
      "revisionRequest" TEXT,
      "verifierPhoneCallable" INTEGER,
      "verifierWhatsappReachable" INTEGER,
      "verifierContactCheckedAt" INTEGER,
      "surveyorId" TEXT NOT NULL,
      "surveyorName" TEXT NOT NULL,
      "managerId" TEXT NOT NULL,
      "managerName" TEXT NOT NULL,
      "visitDate" INTEGER NOT NULL,
      "visitStartTime" INTEGER NOT NULL,
      "submitTime" INTEGER NOT NULL,
      "verifiedAt" INTEGER,
      "createdAt" INTEGER NOT NULL,
      "updatedAt" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "photoEvidence" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "surveyId" TEXT,
      "uploadedBy" TEXT NOT NULL,
      "photoType" TEXT NOT NULL,
      "filename" TEXT NOT NULL,
      "mimeType" TEXT NOT NULL,
      "dataBase64" TEXT NOT NULL,
      "capturedAt" INTEGER NOT NULL,
      "createdAt" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "exportJob" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "kind" TEXT NOT NULL,
      "scope" TEXT NOT NULL,
      "status" TEXT NOT NULL,
      "ownerRole" TEXT NOT NULL,
      "rowCount" INTEGER NOT NULL DEFAULT 0,
      "createdBy" TEXT NOT NULL,
      "createdAt" INTEGER NOT NULL,
      "completedAt" INTEGER
    );

    CREATE TABLE IF NOT EXISTS "auditLog" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "actorId" TEXT NOT NULL,
      "actorRole" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "entityType" TEXT NOT NULL,
      "entityId" TEXT NOT NULL,
      "details" TEXT NOT NULL,
      "createdAt" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "notification" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "recipientUserId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "severity" TEXT NOT NULL DEFAULT 'info',
      "title" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "entityType" TEXT NOT NULL,
      "entityId" TEXT NOT NULL,
      "actionView" TEXT NOT NULL,
      "metadata" TEXT NOT NULL DEFAULT '{}',
      "readAt" INTEGER,
      "createdAt" INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "pushSubscription" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "recipientUserId" TEXT NOT NULL,
      "endpoint" TEXT NOT NULL UNIQUE,
      "p256dh" TEXT NOT NULL,
      "auth" TEXT NOT NULL,
      "expirationTime" INTEGER,
      "userAgent" TEXT,
      "lastPushAt" INTEGER,
      "lastErrorAt" INTEGER,
      "lastError" TEXT,
      "revokedAt" INTEGER,
      "createdAt" INTEGER NOT NULL,
      "updatedAt" INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "userProfile_managerId_idx" ON "userProfile" ("managerId");
    CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId");
    CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId");
    CREATE UNIQUE INDEX IF NOT EXISTS "location_unique_idx" ON "location" ("province", "city", "district", "village");
    CREATE INDEX IF NOT EXISTS "location_province_idx" ON "location" ("province");
    CREATE INDEX IF NOT EXISTS "location_city_idx" ON "location" ("province", "city");
    CREATE INDEX IF NOT EXISTS "location_district_idx" ON "location" ("province", "city", "district");
    CREATE INDEX IF NOT EXISTS "locationBoundary_bbox_idx" ON "locationBoundary" ("minLng", "maxLng", "minLat", "maxLat");
    CREATE INDEX IF NOT EXISTS "locationBoundary_location_idx" ON "locationBoundary" ("province", "city", "district", "village");
    CREATE INDEX IF NOT EXISTS "assignment_surveyor_idx" ON "assignment" ("assignedSurveyorId", "visitDate");
    CREATE INDEX IF NOT EXISTS "assignment_manager_idx" ON "assignment" ("assignedManagerId", "visitDate");
    CREATE INDEX IF NOT EXISTS "assignment_visitDate_idx" ON "assignment" ("visitDate");
    CREATE INDEX IF NOT EXISTS "assignment_status_idx" ON "assignment" ("status");
    CREATE INDEX IF NOT EXISTS "surveyResult_area_idx" ON "surveyResult" ("province", "city", "district", "village");
    CREATE INDEX IF NOT EXISTS "surveyResult_assignment_submit_idx" ON "surveyResult" ("assignmentId", "submitTime");
    CREATE INDEX IF NOT EXISTS "surveyResult_surveyor_idx" ON "surveyResult" ("surveyorId");
    CREATE INDEX IF NOT EXISTS "surveyResult_surveyor_submit_idx" ON "surveyResult" ("surveyorId", "submitTime");
    CREATE INDEX IF NOT EXISTS "surveyResult_manager_idx" ON "surveyResult" ("managerId");
    CREATE INDEX IF NOT EXISTS "surveyResult_manager_submit_idx" ON "surveyResult" ("managerId", "submitTime");
    CREATE INDEX IF NOT EXISTS "surveyResult_lead_idx" ON "surveyResult" ("leadClassification");
    CREATE INDEX IF NOT EXISTS "surveyResult_verification_idx" ON "surveyResult" ("verificationStatus");
    CREATE INDEX IF NOT EXISTS "surveyResult_verification_submit_idx" ON "surveyResult" ("verificationStatus", "submitTime");
    CREATE INDEX IF NOT EXISTS "surveyResult_verification_surveyor_submit_idx" ON "surveyResult" ("verificationStatus", "surveyorId", "submitTime");
    CREATE INDEX IF NOT EXISTS "surveyResult_submitTime_idx" ON "surveyResult" ("submitTime");
    CREATE INDEX IF NOT EXISTS "photoEvidence_surveyId_idx" ON "photoEvidence" ("surveyId");
    CREATE INDEX IF NOT EXISTS "photoEvidence_uploadedBy_idx" ON "photoEvidence" ("uploadedBy");
    CREATE INDEX IF NOT EXISTS "exportJob_kind_idx" ON "exportJob" ("kind");
    CREATE INDEX IF NOT EXISTS "auditLog_entity_idx" ON "auditLog" ("entityType", "entityId");
    CREATE INDEX IF NOT EXISTS "notification_recipient_created_idx" ON "notification" ("recipientUserId", "createdAt");
    CREATE INDEX IF NOT EXISTS "notification_recipient_read_idx" ON "notification" ("recipientUserId", "readAt");
    CREATE INDEX IF NOT EXISTS "notification_entity_idx" ON "notification" ("entityType", "entityId");
    CREATE INDEX IF NOT EXISTS "pushSubscription_recipient_idx" ON "pushSubscription" ("recipientUserId", "revokedAt");
    CREATE UNIQUE INDEX IF NOT EXISTS "pushSubscription_endpoint_idx" ON "pushSubscription" ("endpoint");
  `);

  ensureColumn('surveyResult', 'assignmentId', 'TEXT');
  ensureColumn('surveyResult', 'verificatorId', 'TEXT');
  ensureColumn('surveyResult', 'verificationNotes', 'TEXT');
  ensureColumn('surveyResult', 'verifierPhoneCallable', 'INTEGER');
  ensureColumn('surveyResult', 'verifierWhatsappReachable', 'INTEGER');
  ensureColumn('surveyResult', 'verifierContactCheckedAt', 'INTEGER');
  rawDb.exec(`
    UPDATE "surveyResult"
    SET
      "verifierWhatsappReachable" = CASE
        WHEN "whatsappNumber" IS NOT NULL AND TRIM("whatsappNumber") <> '' AND "verificationStatus" <> 'REJECTED_INVALID' THEN 1
        ELSE 0
      END,
      "verifierPhoneCallable" = CASE
        WHEN "whatsappNumber" IS NOT NULL AND TRIM("whatsappNumber") <> '' AND "verificationStatus" NOT IN ('REJECTED_INVALID', 'MERGED_DUPLICATE') THEN 1
        ELSE 0
      END,
      "verifierContactCheckedAt" = COALESCE("verifiedAt", "updatedAt", "submitTime")
    WHERE "verifierWhatsappReachable" IS NULL
       OR "verifierPhoneCallable" IS NULL
       OR "verifierContactCheckedAt" IS NULL
  `);
  if (columnExists('userProfile', 'visiblePassword')) {
    rawDb.exec('UPDATE "userProfile" SET "visiblePassword" = NULL WHERE "visiblePassword" IS NOT NULL');
  }
}
