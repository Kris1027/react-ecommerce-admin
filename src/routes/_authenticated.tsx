import { getIsAuthenticated } from '@/stores/auth.store';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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
  component: AuthenticatedLayout,
});
