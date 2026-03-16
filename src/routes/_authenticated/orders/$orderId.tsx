import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/orders/$orderId')({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();

  return <div>Order detail: {orderId} (coming next)</div>;
}
