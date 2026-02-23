import { refresh } from '@/features/auth/api/auth.api';
import { initAuthBroadcast } from '@/features/auth/lib/auth-broadcast';
import { useAuthStore } from '@/stores/auth.store';

const REFRESH_TOKEN_KEY = 'refresh_token';

const setupPersistence = () => {
  useAuthStore.subscribe((state, prevState) => {
    if (state.refreshToken === prevState.refreshToken) return;

    if (state.refreshToken) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, state.refreshToken);
    } else {
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  });
};

export const initAuth = async (): Promise<void> => {
  setupPersistence();
  initAuthBroadcast();

  const storedToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (!storedToken) return;
  const success = await refresh(storedToken);
  if (!success) {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};
