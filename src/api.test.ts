import { api, type ApiUser } from './api';

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);
}

const user: ApiUser = {
  id: 'user-1',
  authUserId: 'auth-1',
  name: 'Verifikator Polibeli',
  username: 'verifikator',
  phone: '081200001004',
  role: 'Verificator',
  managerId: '',
  area: 'National Verification Queue',
  status: 'Active',
};

describe('api client', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('sends login credentials to the backend with cookie credentials enabled', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(await jsonResponse({ user }));

    await expect(api.login('verifikator', 'password')).resolves.toEqual({ user });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/login',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ username: 'verifikator', password: 'password' }),
      }),
    );
  });

  it('throws the backend error message for failed requests', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(await jsonResponse({ error: 'Invalid password' }, 401));

    await expect(api.login('verifikator', 'wrong')).rejects.toThrow('Invalid password');
  });

  it('submits verification decisions with duplicate target metadata', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(await jsonResponse({ survey: { id: 'survey-1' } }));

    await api.verifySurvey('survey-1', {
      status: 'MERGED_DUPLICATE',
      duplicateTargetId: 'master-1',
      duplicateTargetStoreName: 'Makmur Jaya Motor Pandean',
      verificationNotes: 'Alamat dan WA sama.',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/surveys/survey-1/verification',
      expect.objectContaining({
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({
          status: 'MERGED_DUPLICATE',
          duplicateTargetId: 'master-1',
          duplicateTargetStoreName: 'Makmur Jaya Motor Pandean',
          verificationNotes: 'Alamat dan WA sama.',
        }),
      }),
    );
  });

  it('loads duplicate candidates with the same score threshold used by verification badges', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(await jsonResponse({ candidates: [] }));

    await api.duplicateCandidates('survey-1', {
      search: 'radiator',
      limit: 10,
      minScore: 70,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/surveys/survey-1/duplicate-candidates?search=radiator&limit=10&minScore=70',
      expect.objectContaining({
        credentials: 'include',
      }),
    );
  });

  it('requests reverse location lookup with GPS accuracy', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(await jsonResponse({ match: null, available: true, source: 'locationBoundary' }));

    await api.reverseLocation(-6.92123, 107.61234, 18);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/locations/reverse?latitude=-6.92123&longitude=107.61234&accuracy=18',
      expect.objectContaining({
        credentials: 'include',
      }),
    );
  });

  it('loads notifications with a real unread count', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(await jsonResponse({ notifications: [], unreadCount: 2 }));

    await expect(api.notifications({ limit: 50 })).resolves.toEqual({ notifications: [], unreadCount: 2 });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notifications?limit=50',
      expect.objectContaining({
        credentials: 'include',
      }),
    );
  });

  it('marks notifications as read through the backend', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(await jsonResponse({ ok: true, unreadCount: 0 }));

    await api.markAllNotificationsRead();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notifications/read-all',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      }),
    );
  });

  it('registers browser push subscriptions for the current user session', async () => {
    const fetchMock = jest.mocked(global.fetch);
    const payload = {
      endpoint: 'https://push.example/subscription-1',
      expirationTime: null,
      keys: { p256dh: 'p256dh-key', auth: 'auth-key' },
      userAgent: 'Jest Browser',
    };
    fetchMock.mockResolvedValueOnce(await jsonResponse({ ok: true }));

    await api.registerPushSubscription(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notifications/push/subscriptions',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload),
      }),
    );
  });

  it('checks push status for the current browser endpoint', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(
      await jsonResponse({
        enabled: true,
        publicKey: 'public-key',
        source: 'local-dev',
        reason: '',
        activeSubscriptions: 1,
        currentDeviceSubscribed: true,
      }),
    );

    await api.pushNotificationStatus('https://push.example/subscription-1');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notifications/push/status?endpoint=https%3A%2F%2Fpush.example%2Fsubscription-1',
      expect.objectContaining({
        credentials: 'include',
      }),
    );
  });

  it('loads dashboard metric drilldown lazily by surveyor', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock
      .mockResolvedValueOnce(await jsonResponse({ metric: 'hot', total: 3, groups: [] }))
      .mockResolvedValueOnce(await jsonResponse({ metric: 'hot', surveyorId: 'surveyor-1', stores: [] }));

    await api.dashboardMetricSurveyors('hot');
    await api.dashboardMetricStores('hot', 'surveyor-1', { limit: 500 });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/dashboard/metrics/hot/surveyors',
      expect.objectContaining({ credentials: 'include' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/dashboard/metrics/hot/surveyors/surveyor-1/stores?limit=500',
      expect.objectContaining({ credentials: 'include' }),
    );
  });

  it('loads verification metric drilldown lazily by surveyor', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock
      .mockResolvedValueOnce(await jsonResponse({ metric: 'duplicate', total: 2, groups: [] }))
      .mockResolvedValueOnce(await jsonResponse({ metric: 'duplicate', surveyorId: 'surveyor-1', stores: [] }));

    await api.verificationMetricSurveyors('duplicate');
    await api.verificationMetricStores('duplicate', 'surveyor-1', { limit: 500 });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/verification/metrics/duplicate/surveyors',
      expect.objectContaining({ credentials: 'include' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/verification/metrics/duplicate/surveyors/surveyor-1/stores?limit=500',
      expect.objectContaining({ credentials: 'include' }),
    );
  });

  it('loads verification metric summary from the backend', async () => {
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValueOnce(
      await jsonResponse({
        summary: {
          pending: 31,
          surveyors: 7,
          warning: 18,
          gps: 5,
          missingPhoto: 31,
          duplicate: 4,
          oldestSubmitTime: '2026-05-02T01:00:00.000Z',
        },
      }),
    );

    await api.verificationMetricSummary();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/verification/metrics/summary',
      expect.objectContaining({ credentials: 'include' }),
    );
  });
});
