import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Eye, MoreHorizontal, Trash2, UserCheck, UserX } from 'lucide-react';

import {
  usersControllerAdminUpdateUserMutation,
  usersControllerDeactivateUserMutation,
  usersControllerFindAllQueryKey,
  usersControllerHardDeleteUserMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import type { UserProfileDto } from '@/api/generated/types.gen';
import { useAuthStore } from '@/stores/auth.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type UsersActionsCellProps = {
  user: UserProfileDto;
};

export const UsersActionsCell = ({ user }: UsersActionsCellProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const isSelf = currentUser?.id === user.id;
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const activateMutation = useMutation({
    ...usersControllerAdminUpdateUserMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersControllerFindAllQueryKey(),
      });
    },
  });

  const deactivateMutation = useMutation({
    ...usersControllerDeactivateUserMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersControllerFindAllQueryKey(),
      });
      setShowDeactivate(false);
    },
  });

  const deleteMutation = useMutation({
    ...usersControllerHardDeleteUserMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersControllerFindAllQueryKey(),
      });
      setShowDelete(false);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <MoreHorizontal size={16} />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() =>
              navigate({
                to: '/users/$userId',
                params: { userId: user.id },
              })
            }
          >
            <Eye size={14} />
            View details
          </DropdownMenuItem>
          {!isSelf && (
            <>
              <DropdownMenuSeparator />
              {user.isActive ? (
                <DropdownMenuItem onClick={() => setShowDeactivate(true)}>
                  <UserX size={14} />
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  disabled={activateMutation.isPending}
                  onClick={() =>
                    activateMutation.mutate({
                      path: { id: user.id },
                      body: { isActive: true },
                    })
                  }
                >
                  <UserCheck size={14} />
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className='text-destructive'
                onClick={() => setShowDelete(true)}
              >
                <Trash2 size={14} />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={showDeactivate}
        onOpenChange={setShowDeactivate}
        title='Deactivate user'
        description={`Are you sure you want to deactivate ${user.email}? They will no longer be able to log in.`}
        confirmLabel='Deactivate'
        variant='destructive'
        isLoading={deactivateMutation.isPending}
        onConfirm={() => deactivateMutation.mutate({ path: { id: user.id } })}
      />

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title='Delete user'
        description={`Are you sure you want to permanently delete ${user.email}? This action cannot be undone.`}
        confirmLabel='Delete'
        variant='destructive'
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ path: { id: user.id } })}
      />
    </>
  );
};
