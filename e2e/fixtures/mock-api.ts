import type { Page } from '@playwright/test';

const API_BASE = 'http://localhost:3000';

// Mock admin user profile
export const MOCK_ADMIN_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN',
  isActive: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

// Mock tokens
const MOCK_ACCESS_TOKEN = 'mock-access-token-for-e2e';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-for-e2e';

// Helper to create a standard API success response
// Backend wraps all responses as { success, data, timestamp }
const apiResponse = <T>(data: T) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

// Paginated empty response — backend shape: { success, data: T[], meta, timestamp }
const emptyPaginatedResponse = () => ({
  success: true,
  data: [] as unknown[],
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  timestamp: new Date().toISOString(),
});

const jsonResponse = (data: unknown, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(data),
});

// Single catch-all that intercepts ALL API requests and routes by path
export const mockAllApis = async (page: Page): Promise<void> => {
  await page.route(`${API_BASE}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    // --- Auth endpoints ---

    if (path === '/auth/login' && method === 'POST') {
      const body = request.postDataJSON();
      if (
        body.email !== MOCK_ADMIN_USER.email ||
        body.password !== 'Admin123!'
      ) {
        return route.fulfill(
          jsonResponse(
            {
              statusCode: 401,
              message: 'Invalid email or password. Please try again.',
            },
            401,
          ),
        );
      }
      return route.fulfill(
        jsonResponse(
          apiResponse({
            accessToken: MOCK_ACCESS_TOKEN,
            refreshToken: MOCK_REFRESH_TOKEN,
          }),
        ),
      );
    }

    if (path === '/auth/refresh' && method === 'POST') {
      return route.fulfill(
        jsonResponse(
          apiResponse({
            accessToken: MOCK_ACCESS_TOKEN,
            refreshToken: MOCK_REFRESH_TOKEN,
          }),
        ),
      );
    }

    if (path === '/auth/logout' && method === 'POST') {
      return route.fulfill(jsonResponse(apiResponse(null)));
    }

    // --- User profile ---

    if (path === '/users/me' && method === 'GET') {
      return route.fulfill(jsonResponse(apiResponse(MOCK_ADMIN_USER)));
    }

    // --- Notification count (non-paginated) ---

    if (path === '/notifications/unread-count' && method === 'GET') {
      return route.fulfill(jsonResponse(apiResponse({ count: 0 })));
    }

    // --- All other GET requests: return empty paginated response ---

    if (method === 'GET') {
      return route.fulfill(jsonResponse(emptyPaginatedResponse()));
    }

    // Non-GET requests we don't handle — let them fail naturally
    return route.abort('connectionrefused');
  });
};

// Auth-only mocks (for login spec where we don't want list mocks interfering)
export const mockAuthApi = async (page: Page): Promise<void> => {
  await mockAllApis(page);
};
