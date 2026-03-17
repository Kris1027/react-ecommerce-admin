import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Edit, MoreHorizontal, Power, Trash2 } from 'lucide-react';

import {
  couponsControllerDeactivateMutation,
  couponsControllerHardDeleteMutation,
  couponsControllerFindAllQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';
import type { CouponDto } from '@/api/generated/types.gen';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CouponsActionsCellProps = {
  coupon: CouponDto;
};

export const CouponsActionsCell = ({ coupon }: CouponsActionsCellProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const deactivateMutation = useMutation({
    ...couponsControllerDeactivateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: couponsControllerFindAllQueryKey(),
      });
      setShowDeactivate(false);
    },
  });

  const deleteMutation = useMutation({
    ...couponsControllerHardDeleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: couponsControllerFindAllQueryKey(),
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
                to: '/coupons/$couponId',
                params: { couponId: coupon.id },
              })
            }
          >
            <Edit size={14} />
            Edit
          </DropdownMenuItem>
          {coupon.isActive && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-destructive'
                onClick={() => setShowDeactivate(true)}
              >
                <Power size={14} />
                Deactivate
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='text-destructive'
            onClick={() => setShowDelete(true)}
          >
            <Trash2 size={14} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={showDeactivate}
        onOpenChange={setShowDeactivate}
        title='Deactivate Coupon'
        description={`Are you sure you want to deactivate coupon "${coupon.code}"? Customers will no longer be able to use it.`}
        confirmLabel='Deactivate'
        variant='destructive'
        isLoading={deactivateMutation.isPending}
        onConfirm={() => deactivateMutation.mutate({ path: { id: coupon.id } })}
      />

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title='Delete Coupon'
        description={`Are you sure you want to permanently delete coupon "${coupon.code}"? This action cannot be undone.`}
        confirmLabel='Delete'
        variant='destructive'
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ path: { id: coupon.id } })}
      />
    </>
  );
};
