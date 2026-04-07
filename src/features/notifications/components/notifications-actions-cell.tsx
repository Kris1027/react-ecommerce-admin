import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  notificationsControllerAdminDeleteOneMutation,
  notificationsControllerAdminMarkAsReadMutation,
  notificationsControllerAdminMarkAsUnreadMutation,
  notificationsControllerFindAllQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';
import type { AdminNotificationDto } from '@/api/generated/types.gen';
import { Button } from '@/components/ui/button';

type NotificationsActionsCellProps = {
  notification: AdminNotificationDto;
};

const NotificationsActionsCell = ({
  notification,
}: NotificationsActionsCellProps) => {
  const queryClient = useQueryClient();

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({
      queryKey: notificationsControllerFindAllQueryKey(),
    });
  };

  const markAsReadMutation = useMutation({
    ...notificationsControllerAdminMarkAsReadMutation(),
    onSuccess: () => {
      invalidateNotifications();
      toast.success('Notification marked as read');
    },
  });

  const markAsUnreadMutation = useMutation({
    ...notificationsControllerAdminMarkAsUnreadMutation(),
    onSuccess: () => {
      invalidateNotifications();
      toast.success('Notification marked as unread');
    },
  });

  const deleteMutation = useMutation({
    ...notificationsControllerAdminDeleteOneMutation(),
    onSuccess: () => {
      invalidateNotifications();
      toast.success('Notification deleted');
    },
  });

  const isPending =
    markAsReadMutation.isPending ||
    markAsUnreadMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className='flex items-center gap-1'>
      {notification.isRead ? (
        <Button
          variant='ghost'
          size='sm'
          aria-label='Mark as unread'
          disabled={isPending}
          onClick={() =>
            markAsUnreadMutation.mutate({ path: { id: notification.id } })
          }
        >
          <EyeOff size={16} />
          <span className='hidden sm:inline'>Mark unread</span>
        </Button>
      ) : (
        <Button
          variant='ghost'
          size='sm'
          aria-label='Mark as read'
          disabled={isPending}
          onClick={() =>
            markAsReadMutation.mutate({ path: { id: notification.id } })
          }
        >
          <Eye size={16} />
          <span className='hidden sm:inline'>Mark read</span>
        </Button>
      )}
      <Button
        variant='ghost'
        size='sm'
        aria-label='Delete notification'
        disabled={isPending}
        onClick={() => deleteMutation.mutate({ path: { id: notification.id } })}
      >
        <Trash2 size={16} className='text-destructive' />
      </Button>
    </div>
  );
};

export { NotificationsActionsCell };
