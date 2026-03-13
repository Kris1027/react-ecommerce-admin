import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/login-form';
import { getIsAuthenticated } from '@/stores/auth.store';
import { z } from 'zod';

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

const LoginPage = () => {
  const { redirect: redirectTo } = Route.useSearch();

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
};

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: () => {
    if (getIsAuthenticated()) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});
