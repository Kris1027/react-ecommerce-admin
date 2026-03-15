import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import type { ProductListItemDto } from '@/api/generated/types.gen';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { MoneyDisplay } from '@/components/shared/money-display';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { ProductsActionsCell } from './products-actions-cell';

const PRODUCT_STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'destructive' },
} as const;

export const columns: ColumnDef<ProductListItemDto, unknown>[] = [
  {
    id: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const firstImage = row.original.images[0];
      return firstImage ? (
        <img
          src={firstImage.url}
          alt={row.original.name}
          className='h-10 w-10 rounded-md border object-cover'
        />
      ) : (
        <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-md border text-xs'>
          —
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ getValue }) => (
      <span className='font-medium'>{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ getValue }) => (
      <MoneyDisplay amount={parseFloat(getValue() as string)} />
    ),
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
    cell: ({ getValue }) => {
      const stock = getValue() as number;
      return (
        <span className={stock <= 5 ? 'text-destructive font-medium' : ''}>
          {stock}
        </span>
      );
    },
  },
  {
    id: 'category',
    accessorFn: (row) => row.category.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ getValue }) => (
      <Badge variant='outline'>{getValue() as string}</Badge>
    ),
  },
  {
    id: 'status',
    accessorFn: (row) => (row.isActive ? 'active' : 'inactive'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ getValue }) => (
      <StatusBadge
        status={getValue() as string}
        statusMap={PRODUCT_STATUS_MAP}
      />
    ),
  },
  {
    id: 'featured',
    accessorFn: (row) => row.isFeatured,
    header: 'Featured',
    cell: ({ getValue }) =>
      getValue() ? <Badge variant='secondary'>Featured</Badge> : null,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ getValue }) =>
      format(new Date(getValue() as string), 'MMM d, yyyy'),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ProductsActionsCell product={row.original} />,
  },
];
