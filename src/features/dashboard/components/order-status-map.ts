import type { StatusConfig } from '@/components/shared/status-badge';

const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: { label: 'Pending', variant: 'outline' },
  CONFIRMED: { label: 'Confirmed', variant: 'secondary' },
  PROCESSING: { label: 'Processing', variant: 'default' },
  SHIPPED: { label: 'Shipped', variant: 'default', className: 'bg-blue-500' },
  DELIVERED: {
    label: 'Delivered',
    variant: 'default',
    className: 'bg-green-500',
  },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
};

export { ORDER_STATUS_MAP };
