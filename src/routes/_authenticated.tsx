import { createFileRoute, Outlet } from '@tanstack/react-router';

const AuthenticatedLayout = () => {
  return (
    <div>
      <p className="bg-muted p-2 text-sm">
        [Authenticated Layout — sidebar + header go here]
      </p>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});
