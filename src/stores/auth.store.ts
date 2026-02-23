import { create } from 'zustand';
import type { UserProfileDto } from '@/api/generated';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfileDto | null;
};

type AuthActions = {
  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: UserProfileDto,
  ) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setAuth: (accessToken, refreshToken, user) =>
    set({ accessToken, refreshToken, user }),

  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

  clearAuth: () => set(initialState),
}));

export const getIsAuthenticated = () => {
  const { accessToken, user } = useAuthStore.getState();
  return accessToken !== null && user !== null;
};

export const getAccessToken = () => useAuthStore.getState().accessToken;

export const getRefreshToken = () => useAuthStore.getState().refreshToken;
