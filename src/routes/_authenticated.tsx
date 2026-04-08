import { getIsAuthenticated } from '@/stores/auth.store';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { Loader2 } from 'lucide-react';

const AuthPendingComponent = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
    </div>
  );
};

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (!getIsAuthenticated()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AppLayout,
  pendingComponent: AuthPendingComponent,
  pendingMs: 200,
});
