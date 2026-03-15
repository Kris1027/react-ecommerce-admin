import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import type { CategoryResponseDto } from '@/api/generated/types.gen';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { CategoriesActionsCell } from './categories-actions-cell';

const CATEGORY_STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'destructive' },
} as const;

export const columns: ColumnDef<CategoryResponseDto, unknown>[] = [
  {
    id: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      return typeof imageUrl === 'string' ? (
        <img
          src={imageUrl}
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
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Slug' />
    ),
    cell: ({ getValue }) => (
      <span className='text-muted-foreground font-mono text-sm'>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'sortOrder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sort Order' />
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
        statusMap={CATEGORY_STATUS_MAP}
      />
    ),
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
    cell: ({ row }) => <CategoriesActionsCell category={row.original} />,
  },
];
