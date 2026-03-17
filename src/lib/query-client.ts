import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown): string => {
  const obj = typeof error === 'object' && error !== null ? error : null;

  // hey-api client wraps the response body — check nested shape first
  const source =
    obj &&
    'response' in obj &&
    typeof (obj as Record<string, unknown>).response === 'object'
      ? (obj as Record<string, unknown>).response
      : obj;

  if (source && typeof source === 'object' && 'message' in source) {
    const msg = (source as { message: unknown }).message;
    if (Array.isArray(msg)) {
      return typeof msg[0] === 'string' ? msg[0] : String(msg[0]);
    }
    if (typeof msg === 'string') return msg;
  }

  return 'Something went wrong';
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    },
  },
});
