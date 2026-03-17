import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:3000';

export const authHandlers = [
  http.post(`${BASE_URL}/api/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
    };

    if (body.email === 'admin@example.com' && body.password === 'password') {
      return HttpResponse.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          isActive: true,
        },
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    );
  }),

  http.post(`${BASE_URL}/api/auth/refresh`, () => {
    return HttpResponse.json({
      accessToken: 'mock-refreshed-token',
      refreshToken: 'mock-refreshed-refresh-token',
    });
  }),

  http.post(`${BASE_URL}/api/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE_URL}/api/users/profile`, () => {
    return HttpResponse.json({
      id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    });
  }),
];
