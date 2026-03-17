import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

import {
  notificationsControllerFindUserNotificationsOptions,
  notificationsControllerFindUserNotificationsQueryKey,
  notificationsControllerGetUnreadCountOptions,
  notificationsControllerGetUnreadCountQueryKey,
  notificationsControllerMarkAsReadMutation,
  notificationsControllerMarkAllAsReadMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import type { NotificationDto } from '@/api/generated/types.gen';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: unreadData } = useQuery({
    ...notificationsControllerGetUnreadCountOptions(),
    refetchInterval: 30_000,
  });

  const { data: notificationsData } = useQuery({
    ...notificationsControllerFindUserNotificationsOptions({
      query: { limit: '5' },
    }),
    enabled: open,
  });

  const unreadCount = unreadData?.data?.count ?? 0;
  const notifications = notificationsData?.data ?? [];

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({
      queryKey: notificationsControllerGetUnreadCountQueryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: notificationsControllerFindUserNotificationsQueryKey(),
    });
  };

  const markAsReadMutation = useMutation({
    ...notificationsControllerMarkAsReadMutation(),
    onSuccess: () => {
      invalidateNotifications();
    },
  });

  const markAllAsReadMutation = useMutation({
    ...notificationsControllerMarkAllAsReadMutation(),
    onSuccess: () => {
      invalidateNotifications();
      toast.success('All notifications marked as read');
    },
  });

  const handleNotificationClick = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate({ path: { id: notification.id } });
    }
    setOpen(false);
    navigate({ to: '/notifications' });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className='bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className='sr-only'>
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : 'Notifications'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80 p-0'>
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <h4 className='text-sm font-semibold'>Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='text-xs'
              disabled={markAllAsReadMutation.isPending}
              onClick={() => markAllAsReadMutation.mutate({})}
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className='max-h-80 overflow-y-auto'>
          {notifications.length === 0 ? (
            <p className='text-muted-foreground py-8 text-center text-sm'>
              No notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type='button'
                className='hover:bg-muted flex w-full gap-3 border-b px-4 py-3 text-left last:border-b-0'
                onClick={() => handleNotificationClick(notification)}
              >
                {!notification.isRead && (
                  <span className='bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full' />
                )}
                <div className={notification.isRead ? 'pl-5' : ''}>
                  <p className='text-sm font-medium'>{notification.title}</p>
                  <p className='text-muted-foreground line-clamp-2 text-xs'>
                    {notification.body}
                  </p>
                  <p className='text-muted-foreground mt-1 text-[10px]'>
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className='border-t px-4 py-2'>
          <Button
            variant='ghost'
            size='sm'
            className='w-full text-xs'
            onClick={() => {
              setOpen(false);
              navigate({ to: '/notifications' });
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
