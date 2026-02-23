import { useAuthStore } from '@/stores/auth.store';

type AuthBroadcastMessage =
  | { type: 'TOKEN_REFRESHED'; accessToken: string; refreshToken: string }
  | { type: 'LOGOUT' };

let channel: BroadcastChannel | null = null;

export const initAuthBroadcast = () => {
  channel = new BroadcastChannel('auth');

  channel.onmessage = (event: MessageEvent<AuthBroadcastMessage>) => {
    const message = event.data;

    switch (message.type) {
      case 'TOKEN_REFRESHED':
        useAuthStore
          .getState()
          .setTokens(message.accessToken, message.refreshToken);
        break;

      case 'LOGOUT':
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        break;
    }
  };
};

export const broadcastTokenRefresh = (
  accessToken: string,
  refreshToken: string,
) => {
  channel?.postMessage({
    type: 'TOKEN_REFRESHED',
    accessToken,
    refreshToken,
  } satisfies AuthBroadcastMessage);
};

export const broadcastLogout = () => {
  channel?.postMessage({ type: 'LOGOUT' } satisfies AuthBroadcastMessage);
};

export const closeAuthBroadcast = () => {
  channel?.close();
  channel = null;
};
