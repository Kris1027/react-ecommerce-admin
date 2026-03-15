import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import type { UserProfileDto } from '@/api/generated/types.gen';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { UsersActionsCell } from './users-actions-cell';

const USER_STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  }
> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'destructive' },
} as const;

export const columns: ColumnDef<UserProfileDto, unknown>[] = [
  {
    id: 'name',
    accessorFn: (row) =>
      [row.firstName, row.lastName].filter(Boolean).join(' ') || '—',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ getValue }) => (
      <span className='font-medium'>{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ getValue }) => {
      const role = getValue() as string;
      return (
        <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
          {role}
        </Badge>
      );
    },
  },
  {
    id: 'status',
    accessorFn: (row) => (row.isActive ? 'active' : 'inactive'),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ getValue }) => (
      <StatusBadge status={getValue() as string} statusMap={USER_STATUS_MAP} />
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
    cell: ({ row }) => <UsersActionsCell user={row.original} />,
  },
];
