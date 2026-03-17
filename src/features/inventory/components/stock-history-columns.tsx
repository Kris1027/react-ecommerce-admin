import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import type { StockMovementDto } from '@/api/generated/types.gen';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { STOCK_MOVEMENT_TYPE_MAP } from '@/components/shared/status-maps';

export const stockHistoryColumns: ColumnDef<StockMovementDto, unknown>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => (
      <StatusBadge
        status={getValue() as string}
        statusMap={STOCK_MOVEMENT_TYPE_MAP}
      />
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ getValue }) => {
      const qty = getValue() as number;
      const isPositive = qty > 0;
      return (
        <span
          className={
            isPositive
              ? 'font-semibold text-green-600'
              : 'font-semibold text-destructive'
          }
        >
          {isPositive ? `+${qty}` : qty}
        </span>
      );
    },
  },
  {
    accessorKey: 'stockBefore',
    header: 'Before',
  },
  {
    accessorKey: 'stockAfter',
    header: 'After',
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ getValue }) => {
      const reason = getValue();
      return typeof reason === 'string' ? (
        <span className='max-w-48 truncate'>{reason}</span>
      ) : (
        <span className='text-muted-foreground'>--</span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ getValue }) =>
      format(new Date(getValue() as string), 'MMM d, yyyy HH:mm'),
  },
];
