import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
  queryClient?: QueryClient;
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

const TestProviders = ({ children, queryClient }: ProvidersProps) => {
  const client = queryClient ?? createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient;
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions,
) => {
  const { queryClient, ...renderOptions } = options ?? {};

  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <TestProviders queryClient={queryClient}>{children}</TestProviders>
    ),
    ...renderOptions,
  });
};

export { createTestQueryClient };
