import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import type { CouponDto } from '@/api/generated/types.gen';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { MoneyDisplay } from '@/components/shared/money-display';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  COUPON_TYPE_MAP,
  COUPON_STATUS_MAP,
} from '@/components/shared/status-maps';
import { CouponsActionsCell } from './coupons-actions-cell';

const getCouponStatus = (coupon: CouponDto): string => {
  if (!coupon.isActive) return 'INACTIVE';
  if (new Date(coupon.validUntil) < new Date()) return 'EXPIRED';
  return 'ACTIVE';
};

export const columns: ColumnDef<CouponDto, unknown>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code' />
    ),
    cell: ({ getValue }) => (
      <span className='font-mono font-medium uppercase'>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => (
      <StatusBadge status={getValue() as string} statusMap={COUPON_TYPE_MAP} />
    ),
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      const { type, value } = row.original;
      return type === 'PERCENTAGE' ? (
        <span>{value}%</span>
      ) : (
        <MoneyDisplay amount={parseFloat(value)} />
      );
    },
  },
  {
    id: 'usage',
    header: 'Usage',
    cell: ({ row }) => {
      const { usageCount, usageLimit } = row.original;
      const isUnlimited =
        typeof usageLimit === 'object' || usageLimit === undefined;
      return <span>{isUnlimited ? '∞' : `${usageCount}/${usageLimit}`}</span>;
    },
  },
  {
    accessorKey: 'validFrom',
    header: 'Valid From',
    cell: ({ getValue }) =>
      format(new Date(getValue() as string), 'MMM d, yyyy'),
  },
  {
    accessorKey: 'validUntil',
    header: 'Valid Until',
    cell: ({ getValue }) =>
      format(new Date(getValue() as string), 'MMM d, yyyy'),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = getCouponStatus(row.original);
      return <StatusBadge status={status} statusMap={COUPON_STATUS_MAP} />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CouponsActionsCell coupon={row.original} />,
  },
];
