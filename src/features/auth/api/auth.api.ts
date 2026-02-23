import {
  authControllerLogin,
  authControllerLogout,
  authControllerRefresh,
  usersControllerGetProfile,
} from '@/api/generated';
import { useAuthStore } from '@/stores/auth.store';
import { broadcastLogout, broadcastTokenRefresh } from '../lib/auth-broadcast';

export class AdminRoleError extends Error {
  constructor() {
    super('Access denied. Admin privileges required.');
    this.name = 'AdminRoleError';
  }
}

export const login = async (email: string, password: string): Promise<void> => {
  const { data: loginResponse } = await authControllerLogin({
    body: { email, password },
    throwOnError: true,
  });

  const { accessToken, refreshToken } = loginResponse.data;
  useAuthStore.getState().setTokens(accessToken, refreshToken);

  const { data: profileResponse } = await usersControllerGetProfile({
    throwOnError: true,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const user = profileResponse.data;

  if (user.role !== 'ADMIN') {
    useAuthStore.getState().clearAuth();
    throw new AdminRoleError();
  }

  useAuthStore.getState().setAuth(accessToken, refreshToken, user);
};

export const refresh = async (
  storedRefreshToken?: string,
): Promise<boolean> => {
  const refreshToken =
    storedRefreshToken ?? useAuthStore.getState().refreshToken;

  if (!refreshToken) return false;

  try {
    const { data: response } = await authControllerRefresh({
      body: { refreshToken },
      throwOnError: true,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    const { data: profileResponse } = await usersControllerGetProfile({
      throwOnError: true,
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });

    const user = profileResponse.data;

    if (user.role !== 'ADMIN') {
      useAuthStore.getState().clearAuth();
      return false;
    }

    useAuthStore.getState().setAuth(newAccessToken, newRefreshToken, user);
    broadcastTokenRefresh(newAccessToken, newRefreshToken);
    return true;
  } catch {
    useAuthStore.getState().clearAuth();
    return false;
  }
};

export const logout = async (): Promise<void> => {
  const refreshToken = useAuthStore.getState().refreshToken;

  useAuthStore.getState().clearAuth();
  broadcastLogout();

  if (refreshToken) {
    try {
      await authControllerLogout({
        body: { refreshToken },
        throwOnError: true,
      });
    } catch {
      // Backend logout failed - refresh token will expire naturally
    }
  }
};

export const getProfile = async (): Promise<void> => {
  const { data: profileResponse } = await usersControllerGetProfile({
    throwOnError: true,
  });

  const user = profileResponse.data;

  const { accessToken, refreshToken } = useAuthStore.getState();
  if (accessToken && refreshToken) {
    useAuthStore.getState().setAuth(accessToken, refreshToken, user);
  }
};
