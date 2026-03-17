import type { StatusConfig } from './status-badge';

const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  CONFIRMED: {
    label: 'Confirmed',
    variant: 'outline',
    className: 'border-blue-500 text-blue-600',
  },
  PROCESSING: {
    label: 'Processing',
    variant: 'outline',
    className: 'border-amber-500 text-amber-600',
  },
  SHIPPED: {
    label: 'Shipped',
    variant: 'outline',
    className: 'border-indigo-500 text-indigo-600',
  },
  DELIVERED: { label: 'Delivered', variant: 'default' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
} as const;

const PAYMENT_STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  SUCCEEDED: { label: 'Succeeded', variant: 'default' },
  FAILED: { label: 'Failed', variant: 'destructive' },
  REFUND_PENDING: {
    label: 'Refund Pending',
    variant: 'outline',
    className: 'border-amber-500 text-amber-600',
  },
  REFUNDED: {
    label: 'Refunded',
    variant: 'outline',
    className: 'border-blue-500 text-blue-600',
  },
  PARTIALLY_REFUNDED: {
    label: 'Partially Refunded',
    variant: 'outline',
    className: 'border-amber-500 text-amber-600',
  },
} as const;

const REVIEW_STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  APPROVED: { label: 'Approved', variant: 'default' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  COMPLETED: { label: 'Completed', variant: 'default' },
} as const;

const COUPON_TYPE_MAP: Record<string, StatusConfig> = {
  PERCENTAGE: {
    label: 'Percentage',
    variant: 'outline',
    className: 'border-blue-500 text-blue-600',
  },
  FIXED_AMOUNT: {
    label: 'Fixed Amount',
    variant: 'outline',
    className: 'border-green-500 text-green-600',
  },
} as const;

const STOCK_MOVEMENT_TYPE_MAP: Record<string, StatusConfig> = {
  ADJUSTMENT: {
    label: 'Adjustment',
    variant: 'outline',
    className: 'border-amber-500 text-amber-600',
  },
  RESTOCK: {
    label: 'Restock',
    variant: 'outline',
    className: 'border-green-500 text-green-600',
  },
  RETURN: {
    label: 'Return',
    variant: 'outline',
    className: 'border-blue-500 text-blue-600',
  },
  SALE: { label: 'Sale', variant: 'default' },
  RESERVATION: {
    label: 'Reservation',
    variant: 'outline',
    className: 'border-indigo-500 text-indigo-600',
  },
  RELEASE: { label: 'Release', variant: 'secondary' },
} as const;

const COUPON_STATUS_MAP: Record<string, StatusConfig> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  SCHEDULED: {
    label: 'Scheduled',
    variant: 'outline',
    className: 'border-blue-500 text-blue-600',
  },
  INACTIVE: { label: 'Inactive', variant: 'secondary' },
  EXPIRED: { label: 'Expired', variant: 'destructive' },
} as const;

export {
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  REVIEW_STATUS_MAP,
  COUPON_TYPE_MAP,
  STOCK_MOVEMENT_TYPE_MAP,
  COUPON_STATUS_MAP,
};
