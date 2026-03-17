import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Mock env before any app modules import it
vi.mock('@/config/env', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3000',
  },
}));

// Import after mock so the client configures with mocked env
import('@/api/client');

import { server } from './mocks/server';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers and clean up after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();

  // Reset Zustand stores to initial state
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    user: null,
  });
  useThemeStore.setState({ theme: 'system' });
});

// Close MSW server after all tests
afterAll(() => {
  server.close();
});
