import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/users/$userId')({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { userId } = Route.useParams();

  return (
    <div>
      <h1>User Detail: {userId}</h1>
      <p>Coming soon...</p>
    </div>
  );
}
