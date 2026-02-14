import { createFileRoute } from '@tanstack/react-router';

const DashboardPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});
