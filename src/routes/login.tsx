import { createFileRoute } from '@tanstack/react-router';

const LoginPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Login</h1>
    </div>
  );
};

export const Route = createFileRoute('/login')({
  component: LoginPage,
});
