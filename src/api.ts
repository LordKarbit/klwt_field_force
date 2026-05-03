export type Role = 'Head' | 'Manager' | 'Surveyor' | 'Verificator' | 'Administrator';
export type VerificationDecision = 'VERIFIED_VALID' | 'NEED_REVISION' | 'REJECTED_INVALID' | 'MERGED_DUPLICATE';
export type DashboardMetricKey = 'submitted' | 'verified' | 'hot' | 'warnings';
export type VerificationMetricKey = 'pending' | 'surveyors' | 'warning' | 'gps' | 'missingPhoto' | 'duplicate';

export type ApiUser = {
  id: string;
  authUserId: string;
  name: string;
  username: string;
  phone: string;
  role: Role;
  managerId: string;
  area: string;
  status: 'Active' | 'Inactive';
  email?: string;
};

export type UserPayload = {
  name: string;
  username: string;
  password?: string;
  phone: string;
  role: Role;
  managerId?: string;
  status?: 'Active' | 'Inactive';
};

export type SurveyPayload = {
  assignmentId?: string;
  storeName: string;
  storeAlias?: string;
  visitOutcome: string;
  plannedOrUnplanned: 'PLANNED' | 'UNPLANNED';
  province: string;
  city: string;
  district: string;
  village: string;
  addressDetail: string;
  landmark: string;
  latitude: string;
  longitude: string;
  gpsAccuracy: number;
  gpsWarningFlag: boolean;
  gpsDistanceFromTarget: number;
  contactPersonName: string;
  picType: string;
  whatsappNumber?: string;
  waEmptyReason?: string;
  purchasingDecisionMaker: string;
  decisionMakerAvailability: string;
  businessType: string;
  vehicleSpecialization: string[];
  storeScale: string;
  coolingProducts: string[];
  coolingShelfSize: string;
  coolingSalesActivity: string;
  coolingBrands: string[];
  productSellingSegment: string;
  lowCostImportShare: string;
  supplierType: string[];
  supplierName?: string;
  supplierDependency: string;
  supplierSatisfaction: string;
  returnEase: string;
  deliverySpeed: string;
  paymentMethod: string;
  restockFrequency: string;
  purchaseSizeRange: string;
  monthlyPurchaseValue: string;
  marginExpectation: string;
  currentOrderMethod: string[];
  mainPurchaseDriver: string[];
  priceSensitivity: string;
  opennessToNewSupplier: string;
  reasonToTryNewSupplier: string[];
  willingnessToReceiveFollowUp: string;
  storefrontPhotoUrl?: string;
  interiorPhotoUrl?: string;
  picPhotoUrl?: string;
  photoMissingReason?: string;
  surveyorNotes?: string;
};

export type SurveySubmitResult = {
  id: string;
  assignmentId?: string;
  storeCode: string;
  storeName: string;
  visitOutcome: string;
  merchantPotentialScore: number;
  merchantGrade: string;
  dataQualityScore: number;
  dataQualityGrade: string;
  leadClassification: string;
  warningFlags: string[];
  verificationStatus: string;
  duplicateCandidateCount: number;
  duplicateTopScore: number;
};

export type DuplicateCandidate = {
  row: SurveyHistoryItem;
  score: number;
};

export type LocationAddress = {
  province: string;
  city: string;
  district: string;
  village: string;
};

export type ReverseLocationMatch = LocationAddress & {
  boundaryId: string;
  code: string | null;
  source: string;
};

export type SurveyHistoryItem = SurveySubmitResult & {
  storeAlias: string;
  verificatorId: string;
  verificationNotes: string;
  revisionRequest: string;
  verifiedAt: string;
  verifierPhoneCallable: boolean | null;
  verifierWhatsappReachable: boolean | null;
  verifierContactCheckedAt: string;
  surveyorId: string;
  surveyorName: string;
  managerName: string;
  province: string;
  city: string;
  district: string;
  village: string;
  addressDetail: string;
  landmark: string;
  latitude: string;
  longitude: string;
  gpsAccuracy: number;
  gpsWarningFlag: boolean;
  gpsDistanceFromTarget: number;
  visitOutcome: string;
  plannedOrUnplanned: 'PLANNED' | 'UNPLANNED';
  contactPersonName: string;
  picType: string;
  whatsappNumber: string;
  waEmptyReason: string;
  purchasingDecisionMaker: string;
  decisionMakerAvailability: string;
  businessType: string;
  vehicleSpecialization: string[];
  storeScale: string;
  coolingProducts: string[];
  coolingShelfSize: string;
  coolingSalesActivity: string;
  coolingBrands: string[];
  productSellingSegment: string;
  lowCostImportShare: string;
  supplierType: string[];
  supplierName: string;
  supplierDependency: string;
  supplierSatisfaction: string;
  returnEase: string;
  deliverySpeed: string;
  paymentMethod: string;
  restockFrequency: string;
  purchaseSizeRange: string;
  monthlyPurchaseValue: string;
  marginExpectation: string;
  currentOrderMethod: string[];
  mainPurchaseDriver: string[];
  priceSensitivity: string;
  opennessToNewSupplier: string;
  reasonToTryNewSupplier: string[];
  willingnessToReceiveFollowUp: string;
  storefrontPhotoUrl: string;
  interiorPhotoUrl: string;
  picPhotoUrl: string;
  photoMissingReason: string;
  surveyorNotes: string;
  candidateStoreStatus: string;
  submitTime: string;
  updatedAt: string;
};

export type AssignmentItem = {
  id: string;
  storeName: string;
  province: string;
  city: string;
  district: string;
  village: string;
  addressDetail: string;
  landmark: string;
  latitude: string;
  longitude: string;
  assignedManagerId: string;
  assignedManagerName: string;
  assignedSurveyorId: string;
  assignedSurveyorName: string;
  visitDate: string;
  priority: 'High' | 'Medium' | 'Low';
  visitObjective: string;
  plannedOrUnplanned: 'PLANNED' | 'UNPLANNED';
  status: string;
  notes: string;
};

export type AnalyticsBar = { label: string; value: number; color: string };
export type ExportJobItem = {
  id: string;
  name: string;
  kind: string;
  scope: string;
  status: string;
  ownerRole: string;
  rowCount: number;
  createdAt: string;
  completedAt: string;
};
export type AnalyticsPayload = {
  metrics: {
    submitted: number;
    verified: number;
    hot: number;
    qualified: number;
    warning: number;
    avgMerchantScore: number;
    avgDataQuality: number;
    waContactability: number;
    supplierDissatisfaction: number;
    lowCostImportAcceptance: number;
    photoEvidenceComplete: number;
    validRate: number;
  };
  leadBars: AnalyticsBar[];
  brandBars: AnalyticsBar[];
  supplierTypeBars: AnalyticsBar[];
  cityBars: AnalyticsBar[];
  managerPerformance: Array<{ manager: string; submitted: number; verified: number }>;
  surveyorPerformance: Array<{
    surveyor: string;
    submitted: number;
    verified: number;
    hotLead: number;
    warning: number;
    averageDataQualityScore: number;
    averageMerchantScore: number;
    validRate: number;
  }>;
  hotLeadPreview: SurveyHistoryItem[];
  exportJobs: ExportJobItem[];
  systemStatus: Array<{ label: string; enabled: boolean; detail: string }>;
};

export type DashboardMetricSurveyorGroup = {
  surveyorId: string;
  surveyorName: string;
  managerName: string;
  count: number;
  submitted: number;
  verified: number;
  hot: number;
  warnings: number;
  avgMerchant: number;
  avgQuality: number;
  latestSubmitTime: string;
};

export type DashboardTimeSeriesMode = 'runRate' | 'target';

export type DashboardTimeSeriesPoint = {
  dateKey: string;
  submitted: number;
  verified: number;
  hot: number;
  warnings: number;
};

export type DashboardTimeSeriesSurveyorOption = {
  id: string;
  name: string;
  submitted: number;
};

export type DashboardTimeSeriesSummary = {
  mode: DashboardTimeSeriesMode;
  target: number;
  targetDays: number;
  selectedSurveyorId: string;
  selectedSurveyorName: string;
  firstSubmitDate: string;
  lastSubmitDate: string;
  rangeStart: string;
  rangeEnd: string;
  generatedAt: string;
  totals: Record<DashboardMetricKey, number>;
  peak: Record<DashboardMetricKey, number>;
  progressPercent: number;
};

export type DashboardTimeSeriesPayload = {
  points: DashboardTimeSeriesPoint[];
  surveyors: DashboardTimeSeriesSurveyorOption[];
  summary: DashboardTimeSeriesSummary;
};

export type VerificationMetricSurveyorGroup = {
  surveyorId: string;
  surveyorName: string;
  managerName: string;
  count: number;
  warning: number;
  gps: number;
  missingPhoto: number;
  duplicate: number;
  hot: number;
  avgQuality: number;
  oldestSubmitTime: string;
  latestSubmitTime: string;
};

export type VerificationMetricSummary = {
  pending: number;
  surveyors: number;
  warning: number;
  gps: number;
  missingPhoto: number;
  duplicate: number;
  oldestSubmitTime: string;
};

export type VerificationHistorySurveyorGroup = {
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
  avgQuality: number;
  oldestSubmitTime: string;
  latestSubmitTime: string;
  latestVerifiedAt: string;
};

export type AssignmentPayload = {
  storeName: string;
  province: string;
  city: string;
  district: string;
  village: string;
  addressDetail: string;
  landmark: string;
  latitude?: string;
  longitude?: string;
  assignedSurveyorId: string;
  visitDate: string;
  priority: 'High' | 'Medium' | 'Low';
  visitObjective: string;
  status?: string;
  notes?: string;
};

export type ImportResult = {
  kind: string;
  fileName: string;
  processedRows: number;
  created: number;
  skipped: number;
  errors: string[];
};

export type NotificationItem = {
  id: string;
  type: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  title: string;
  body: string;
  entityType: string;
  entityId: string;
  actionView: string;
  metadata: Record<string, unknown>;
  readAt: string;
  createdAt: string;
};

export type PushNotificationStatus = {
  enabled: boolean;
  publicKey: string;
  source: 'environment' | 'local-dev' | 'disabled';
  reason: string;
  activeSubscriptions: number;
  currentDeviceSubscribed: boolean;
};

export type PushSubscriptionPayload = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
};

const GET_CACHE_TTL_MS = 30_000;
const getCache = new Map<string, { expiresAt: number; promise: Promise<unknown> }>();
type ApiRequestOptions = RequestInit & { timeoutMs?: number };

function isCacheableGet(url: string, options: RequestInit) {
  return (options.method ?? 'GET').toUpperCase() === 'GET' && url !== '/api/session' && !url.startsWith('/api/notifications');
}

function clearApiCache(prefixes?: string[]) {
  if (!prefixes?.length) {
    getCache.clear();
    return;
  }

  for (const key of getCache.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) getCache.delete(key);
  }
}

function invalidateAfter<T>(promise: Promise<T>, prefixes?: string[]) {
  return promise.then((result) => {
    clearApiCache(prefixes);
    return result;
  });
}

function surveyListUrl(baseUrl: string, options: { limit?: number; cursor?: string } = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.set('limit', String(options.limit));
  if (options.cursor) params.set('cursor', options.cursor);
  const query = params.toString();
  return query ? `${baseUrl}?${query}` : baseUrl;
}

function assignmentListUrl(options: { visitDate?: string; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (options.visitDate) params.set('visitDate', options.visitDate);
  if (options.limit) params.set('limit', String(options.limit));
  const query = params.toString();
  return query ? `/api/assignments?${query}` : '/api/assignments';
}

function jakartaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

async function request<T>(url: string, options: ApiRequestOptions = {}) {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const cacheable = isCacheableGet(url, fetchOptions);
  if (cacheable) {
    const cached = getCache.get(url);
    if (cached && cached.expiresAt > Date.now()) return cached.promise as Promise<T>;
    getCache.delete(url);
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  const promise = fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    signal: controller.signal,
    headers: {
      'content-type': 'application/json',
      ...fetchOptions.headers,
    },
  })
    .finally(() => globalThis.clearTimeout(timeout))
    .then(async (response) => {
      const data = (await response.json().catch(() => ({}))) as T & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? 'Request failed');
      }
      return data;
    });

  if (cacheable) {
    getCache.set(url, { expiresAt: Date.now() + GET_CACHE_TTL_MS, promise });
    promise.catch(() => {
      if (getCache.get(url)?.promise === promise) getCache.delete(url);
    });
  }

  return promise;
}

export const api = {
  login(username: string, password: string) {
    return invalidateAfter(
      request<{ user: ApiUser }>('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    );
  },
  logout() {
    return request<{ ok: true }>('/api/logout', {
      method: 'POST',
    }).finally(() => clearApiCache());
  },
  session() {
    return request<{ user: ApiUser | null }>('/api/session');
  },
  users() {
    return request<{ users: ApiUser[] }>('/api/users');
  },
  createUser(payload: Required<Pick<UserPayload, 'password'>> & UserPayload) {
    return invalidateAfter(
      request<{ user: ApiUser }>('/api/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      ['/api/users', '/api/team/surveyors', '/api/analytics'],
    );
  },
  updateUser(id: string, payload: UserPayload) {
    return invalidateAfter(
      request<{ user: ApiUser }>(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
      ['/api/users', '/api/team/surveyors', '/api/analytics'],
    );
  },
  setUserStatus(id: string, status: ApiUser['status']) {
    return invalidateAfter(
      request<{ ok: true }>(`/api/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
      ['/api/users', '/api/team/surveyors', '/api/analytics'],
    );
  },
  deleteUser(id: string) {
    return invalidateAfter(
      request<{ ok: true }>(`/api/users/${id}`, {
        method: 'DELETE',
      }),
      ['/api/users', '/api/team/surveyors', '/api/analytics'],
    );
  },
  analytics() {
    return request<AnalyticsPayload>('/api/analytics', { timeoutMs: 15_000 });
  },
  teamSurveyors() {
    return request<{ surveyors: ApiUser[] }>('/api/team/surveyors');
  },
  notifications(options: { limit?: number; unreadOnly?: boolean } = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', String(options.limit));
    if (options.unreadOnly !== undefined) params.set('unreadOnly', String(options.unreadOnly));
    const query = params.toString();
    return request<{ notifications: NotificationItem[]; unreadCount: number }>(query ? `/api/notifications?${query}` : '/api/notifications');
  },
  markNotificationRead(id: string) {
    return invalidateAfter(
      request<{ notification: NotificationItem }>(`/api/notifications/${encodeURIComponent(id)}/read`, {
        method: 'PATCH',
      }),
      ['/api/notifications'],
    );
  },
  markAllNotificationsRead() {
    return invalidateAfter(
      request<{ ok: true; unreadCount: number }>('/api/notifications/read-all', {
        method: 'POST',
      }),
      ['/api/notifications'],
    );
  },
  pushNotificationStatus(endpoint?: string) {
    const params = new URLSearchParams();
    if (endpoint) params.set('endpoint', endpoint);
    const query = params.toString();
    return request<PushNotificationStatus>(query ? `/api/notifications/push/status?${query}` : '/api/notifications/push/status');
  },
  registerPushSubscription(payload: PushSubscriptionPayload) {
    return request<{ ok: true }>('/api/notifications/push/subscriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  revokePushSubscription(endpoint: string) {
    return request<{ ok: true }>('/api/notifications/push/subscriptions', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint }),
    });
  },
  assignments(options: { visitDate?: string; limit?: number } = {}) {
    return request<{ assignments: AssignmentItem[] }>(assignmentListUrl(options));
  },
  createAssignment(payload: AssignmentPayload) {
    return invalidateAfter(
      request<{ assignment: AssignmentItem }>('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      ['/api/assignments', '/api/analytics'],
    );
  },
  reassignAssignment(id: string, payload: Pick<AssignmentPayload, 'assignedSurveyorId'> & Partial<AssignmentPayload>) {
    return invalidateAfter(
      request<{ assignment: AssignmentItem }>(`/api/assignments/${id}/reassign`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
      ['/api/assignments', '/api/analytics'],
    );
  },
  uploadEvidence(payload: { photoType: string; dataUrl: string }) {
    return request<{ id: string; url: string }>('/api/evidence', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  exportData(kind: string) {
    return request<{ rows: Array<Record<string, unknown>> }>(`/api/exports/${encodeURIComponent(kind)}`, { timeoutMs: 30_000 });
  },
  importXlsx(kind: string, payload: { fileName: string; dataBase64: string }) {
    return invalidateAfter(
      request<{ result: ImportResult }>(`/api/imports/${encodeURIComponent(kind)}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        timeoutMs: 60_000,
      }),
    );
  },
  provinces() {
    return request<{ provinces: string[] }>('/api/locations/provinces');
  },
  cities(province: string) {
    return request<{ cities: string[] }>(`/api/locations/cities?province=${encodeURIComponent(province)}`);
  },
  districts(province: string, city: string) {
    return request<{ districts: string[] }>(
      `/api/locations/districts?province=${encodeURIComponent(province)}&city=${encodeURIComponent(city)}`,
    );
  },
  villages(province: string, city: string, district: string) {
    return request<{ villages: string[] }>(
      `/api/locations/villages?province=${encodeURIComponent(province)}&city=${encodeURIComponent(city)}&district=${encodeURIComponent(
        district,
      )}`,
    );
  },
  reverseLocation(latitude: number, longitude: number, accuracy?: number) {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
    });
    if (typeof accuracy === 'number') params.set('accuracy', String(accuracy));
    return request<{ match: ReverseLocationMatch | null; available: boolean; source: string }>(`/api/locations/reverse?${params.toString()}`);
  },
  validateLocation(payload: LocationAddress) {
    return request<{ valid: boolean; source?: string }>('/api/locations/validate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  submitSurvey(payload: SurveyPayload) {
    return invalidateAfter(
      request<{ survey: SurveyHistoryItem }>('/api/surveys', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      ['/api/surveys', '/api/analytics', '/api/dashboard', '/api/assignments', '/api/exports'],
    );
  },
  mySurveys(options: { limit?: number; cursor?: string } = {}) {
    return request<{ surveys: SurveyHistoryItem[] }>(surveyListUrl('/api/surveys/mine', { limit: options.limit ?? 100, cursor: options.cursor }));
  },
  surveys(options: { limit?: number; cursor?: string } = {}) {
    return request<{ surveys: SurveyHistoryItem[] }>(surveyListUrl('/api/surveys', { limit: options.limit ?? 250, cursor: options.cursor }));
  },
  survey(id: string) {
    return request<{ survey: SurveyHistoryItem }>(`/api/surveys/${id}`);
  },
  dashboardMetricSurveyors(metric: DashboardMetricKey) {
    return request<{ metric: DashboardMetricKey; total: number; groups: DashboardMetricSurveyorGroup[] }>(
      `/api/dashboard/metrics/${encodeURIComponent(metric)}/surveyors`,
      { timeoutMs: 15_000 },
    );
  },
  dashboardMetricStores(metric: DashboardMetricKey, surveyorId: string, options: { limit?: number } = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', String(options.limit));
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return request<{ metric: DashboardMetricKey; surveyorId: string; stores: SurveyHistoryItem[] }>(
      `/api/dashboard/metrics/${encodeURIComponent(metric)}/surveyors/${encodeURIComponent(surveyorId)}/stores${suffix}`,
      { timeoutMs: 15_000 },
    );
  },
  dashboardTimeSeries(options: { mode?: DashboardTimeSeriesMode; surveyorId?: string } = {}) {
    const params = new URLSearchParams();
    if (options.mode) params.set('mode', options.mode);
    if (options.surveyorId && options.surveyorId !== 'all') params.set('surveyorId', options.surveyorId);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return request<DashboardTimeSeriesPayload>(`/api/dashboard/time-series${suffix}`, { timeoutMs: 15_000 });
  },
  verificationMetricSurveyors(metric: VerificationMetricKey) {
    return request<{ metric: VerificationMetricKey; total: number; groups: VerificationMetricSurveyorGroup[] }>(
      `/api/verification/metrics/${encodeURIComponent(metric)}/surveyors`,
      { timeoutMs: 15_000 },
    );
  },
  verificationMetricSummary() {
    return request<{ summary: VerificationMetricSummary }>('/api/verification/metrics/summary', { timeoutMs: 15_000 });
  },
  verificationHistorySurveyors() {
    return request<{ total: number; groups: VerificationHistorySurveyorGroup[] }>('/api/verification/history/surveyors', { timeoutMs: 15_000 });
  },
  verificationHistoryStores(surveyorId: string, options: { limit?: number } = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', String(options.limit));
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return request<{ surveyorId: string; stores: SurveyHistoryItem[] }>(
      `/api/verification/history/surveyors/${encodeURIComponent(surveyorId)}/stores${suffix}`,
      { timeoutMs: 15_000 },
    );
  },
  verificationMetricStores(metric: VerificationMetricKey, surveyorId: string, options: { limit?: number } = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', String(options.limit));
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return request<{ metric: VerificationMetricKey; surveyorId: string; stores: SurveyHistoryItem[] }>(
      `/api/verification/metrics/${encodeURIComponent(metric)}/surveyors/${encodeURIComponent(surveyorId)}/stores${suffix}`,
      { timeoutMs: 15_000 },
    );
  },
  duplicateCandidates(id: string, options: { search?: string; limit?: number; minScore?: number } = {}) {
    const params = new URLSearchParams();
    if (options.search) params.set('search', options.search);
    if (options.limit) params.set('limit', String(options.limit));
    if (options.minScore !== undefined) params.set('minScore', String(options.minScore));
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return request<{ candidates: DuplicateCandidate[] }>(`/api/surveys/${encodeURIComponent(id)}/duplicate-candidates${suffix}`, { timeoutMs: 15_000 });
  },
  verifySurvey(
    id: string,
    payload: {
      status: VerificationDecision;
      verificationNotes?: string;
      revisionRequest?: string;
      duplicateTargetId?: string;
      duplicateTargetStoreName?: string;
      verifierPhoneCallable?: boolean | null;
      verifierWhatsappReachable?: boolean | null;
    },
  ) {
    return invalidateAfter(
      request<{ survey: SurveyHistoryItem }>(`/api/surveys/${id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
      ['/api/surveys', '/api/analytics', '/api/dashboard', '/api/exports'],
    );
  },
  annulVerification(id: string, payload: { reason?: string } = {}) {
    return invalidateAfter(
      request<{ survey: SurveyHistoryItem }>(`/api/surveys/${id}/verification/annul`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
      ['/api/surveys', '/api/verification', '/api/analytics', '/api/dashboard', '/api/exports'],
    );
  },
  prefetchForRole(role: Role) {
    const tasks: Array<Promise<unknown>> = [api.provinces()];
    if (role === 'Surveyor') {
      tasks.push(api.assignments({ visitDate: jakartaDateKey(), limit: 100 }), api.mySurveys());
    } else if (role === 'Verificator') {
      tasks.push(api.surveys(), api.verificationMetricSummary(), api.verificationHistorySurveyors());
    } else {
      tasks.push(api.analytics(), api.assignments(), api.teamSurveyors());
      if (role === 'Administrator') tasks.push(api.users());
    }
    tasks.forEach((task) => task.catch(() => undefined));
  },
};
