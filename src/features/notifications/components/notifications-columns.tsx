import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';

import type { AdminNotificationDto } from '@/api/generated/types.gen';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { NOTIFICATION_TYPE_MAP } from '@/components/shared/status-maps';
import { Badge } from '@/components/ui/badge';
import { NotificationsActionsCell } from './notifications-actions-cell';

export const columns: ColumnDef<AdminNotificationDto, unknown>[] = [
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ getValue }) => (
      <StatusBadge
        status={getValue() as string}
        statusMap={NOTIFICATION_TYPE_MAP}
      />
    ),
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ getValue }) => {
      const userId = getValue() as string;
      return (
        <Link
          to='/users/$userId'
          params={{ userId }}
          className='text-primary hover:underline font-mono text-xs'
        >
          {userId.slice(0, 8)}...
        </Link>
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ getValue }) => (
      <span className='font-medium'>{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'body',
    header: 'Message',
    cell: ({ getValue }) => (
      <span className='text-muted-foreground block max-w-xs truncate text-sm'>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'isRead',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue() ? (
        <Badge variant='secondary'>Read</Badge>
      ) : (
        <Badge variant='default'>Unread</Badge>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ getValue }) =>
      format(new Date(getValue() as string), 'MMM d, yyyy HH:mm'),
  },
  {
    id: 'actions',
    cell: ({ row }) => <NotificationsActionsCell notification={row.original} />,
  },
];
