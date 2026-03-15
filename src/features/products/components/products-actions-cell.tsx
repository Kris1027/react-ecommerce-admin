import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Eye, MoreHorizontal, Power, PowerOff, Trash2 } from 'lucide-react';

import {
  productsControllerFindAllQueryKey,
  productsControllerHardDeleteMutation,
  productsControllerUpdateMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import type { ProductListItemDto } from '@/api/generated/types.gen';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ProductsActionsCellProps = {
  product: ProductListItemDto;
};

export const ProductsActionsCell = ({ product }: ProductsActionsCellProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const toggleActiveMutation = useMutation({
    ...productsControllerUpdateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsControllerFindAllQueryKey(),
      });
      setShowDeactivate(false);
    },
  });

  const deleteMutation = useMutation({
    ...productsControllerHardDeleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsControllerFindAllQueryKey(),
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
                to: '/products/$productSlug',
                params: { productSlug: product.slug },
              })
            }
          >
            <Eye size={14} />
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {product.isActive ? (
            <DropdownMenuItem onClick={() => setShowDeactivate(true)}>
              <PowerOff size={14} />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={toggleActiveMutation.isPending}
              onClick={() =>
                toggleActiveMutation.mutate({
                  path: { id: product.id },
                  body: { isActive: true },
                })
              }
            >
              <Power size={14} />
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
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={showDeactivate}
        onOpenChange={setShowDeactivate}
        title='Deactivate product'
        description={`Are you sure you want to deactivate "${product.name}"? It will be hidden from the store.`}
        confirmLabel='Deactivate'
        variant='destructive'
        isLoading={toggleActiveMutation.isPending}
        onConfirm={() =>
          toggleActiveMutation.mutate({
            path: { id: product.id },
            body: { isActive: false },
          })
        }
      />

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title='Delete product'
        description={`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`}
        confirmLabel='Delete'
        variant='destructive'
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ path: { id: product.id } })}
      />
    </>
  );
};
