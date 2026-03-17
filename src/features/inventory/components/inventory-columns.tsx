import type { ColumnDef } from '@tanstack/react-table';

import type { StockInfoDto } from '@/api/generated/types.gen';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { InventoryActionsCell } from './inventory-actions-cell';

export const columns: ColumnDef<StockInfoDto, unknown>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
    cell: ({ getValue }) => (
      <span className='font-medium'>{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ getValue }) => {
      const sku = getValue();
      return typeof sku === 'string' ? (
        <span className='font-mono text-sm'>{sku}</span>
      ) : (
        <span className='text-muted-foreground'>--</span>
      );
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
  },
  {
    accessorKey: 'reservedStock',
    header: 'Reserved',
  },
  {
    accessorKey: 'availableStock',
    header: 'Available',
    cell: ({ row }) => {
      const { availableStock, isLowStock } = row.original;
      return (
        <span className={isLowStock ? 'font-semibold text-destructive' : ''}>
          {availableStock}
        </span>
      );
    },
  },
  {
    accessorKey: 'lowStockThreshold',
    header: 'Threshold',
  },
  {
    accessorKey: 'isLowStock',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue() ? (
        <Badge variant='destructive'>Low Stock</Badge>
      ) : (
        <Badge variant='default'>In Stock</Badge>
      ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <InventoryActionsCell stock={row.original} />,
  },
];
