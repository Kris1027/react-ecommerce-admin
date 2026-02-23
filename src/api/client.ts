import { client } from '@/api/generated/client.gen';
import { env } from '@/config/env';
import { refresh } from '@/features/auth/api/auth.api';
import { getAccessToken } from '@/stores/auth.store';

client.setConfig({
  baseUrl: env.VITE_API_URL,
});

client.interceptors.request.use((request) => {
  const token = getAccessToken();
  if (token && !request.headers.has('Authorization')) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

let refreshPromise: Promise<boolean> | null = null;

client.interceptors.response.use(async (response, request) => {
  if (response.status !== 401) return response;

  const url = new URL(request.url);
  if (url.pathname.includes('/auth/')) return response;

  if (refreshPromise) return response;

  refreshPromise = refresh().finally(() => {
    refreshPromise = null;
  });

  const refreshed = await refreshPromise;

  if (!refreshed) return response;

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(request.method);
  if (hasBody) return response;

  const newToken = getAccessToken();
  const headers = new Headers(request.headers);
  if (newToken) {
    headers.set('Authorization', `Bearer ${newToken}`);
  }

  return fetch(request.url, {
    method: request.method,
    headers,
  });
});
