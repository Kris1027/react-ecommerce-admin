import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/query-client';
import { applyTheme, useThemeStore } from '@/stores/theme.store';
import { OfflineBanner } from '@/components/shared/offline-banner';
import { lazy, Suspense, useEffect } from 'react';

const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null;

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((m) => ({
        default: m.ReactQueryDevtools,
      })),
    )
  : () => null;

const RootLayout = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (useThemeStore.getState().theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      <Outlet />
      <Toaster richColors closeButton position='bottom-right' />
      <Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
        <TanStackRouterDevtools position='bottom-right' />
      </Suspense>
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
