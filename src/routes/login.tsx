import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/login-form';
import { getIsAuthenticated } from '@/stores/auth.store';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
};

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (getIsAuthenticated()) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});
