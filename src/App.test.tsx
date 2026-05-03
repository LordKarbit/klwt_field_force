import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { ApiUser } from './api';

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);
}

const verificatorUser: ApiUser = {
  id: 'verificator-1',
  authUserId: 'auth-verificator-1',
  name: 'Verifikator Polibeli',
  username: 'verifikator.polibeli',
  phone: '081200001004',
  role: 'Verificator',
  managerId: '',
  area: 'National Verification Queue',
  status: 'Active',
};

function mockFetch() {
  global.fetch = jest.fn((input: RequestInfo | URL) => {
    const url = String(input);
    if (url === '/api/session') return jsonResponse({ user: null });
    if (url === '/api/login') return jsonResponse({ user: verificatorUser });
    if (url === '/api/notifications?limit=50') return jsonResponse({ notifications: [], unreadCount: 0 });
    if (url === '/api/verification/metrics/pending/surveyors') {
      return jsonResponse({ metric: 'pending', total: 0, groups: [] });
    }
    if (url === '/api/verification/metrics/summary') {
      return jsonResponse({
        summary: {
          pending: 0,
          surveyors: 0,
          warning: 0,
          gps: 0,
          missingPhoto: 0,
          duplicate: 0,
          oldestSubmitTime: null,
        },
      });
    }
    if (url === '/api/surveys') return jsonResponse({ surveys: [] });
    return jsonResponse({ error: `Unhandled test request: ${url}` }, 404);
  });
}

describe('application entry flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockFetch();
  });

  it('shows the login page when there is no active session', async () => {
    render(<App />);

    expect(await screen.findByText('Manajemen Survei Field Force')).toBeInTheDocument();
    expect(screen.getByLabelText('Username / nomor HP')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata sandi')).toBeInTheDocument();
  });

  it('logs in and routes a verificator to the verification queue', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Manajemen Survei Field Force');
    await user.type(screen.getByLabelText('Username / nomor HP'), 'verifikator.polibeli');
    await user.type(screen.getByLabelText('Kata sandi'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Masuk Dashboard' }));

    expect(await screen.findByText('Antrean Belum Diverifikasi')).toBeInTheDocument();
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith('/api/verification/metrics/pending/surveyors', expect.any(Object)),
    );
    expect(global.fetch).not.toHaveBeenCalledWith('/api/surveys?limit=250', expect.any(Object));
  });
});
