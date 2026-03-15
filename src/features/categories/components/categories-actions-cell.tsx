import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Eye, MoreHorizontal, Power, PowerOff, Trash2 } from 'lucide-react';

import {
  categoriesControllerFindAllQueryKey,
  categoriesControllerHardDeleteMutation,
  categoriesControllerUpdateMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import type { CategoryResponseDto } from '@/api/generated/types.gen';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CategoriesActionsCellProps = {
  category: CategoryResponseDto;
};

export const CategoriesActionsCell = ({
  category,
}: CategoriesActionsCellProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const toggleActiveMutation = useMutation({
    ...categoriesControllerUpdateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoriesControllerFindAllQueryKey(),
      });
      setShowDeactivate(false);
    },
  });

  const deleteMutation = useMutation({
    ...categoriesControllerHardDeleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoriesControllerFindAllQueryKey(),
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
                to: '/categories/$categorySlug',
                params: { categorySlug: category.slug },
              })
            }
          >
            <Eye size={14} />
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {category.isActive ? (
            <DropdownMenuItem onClick={() => setShowDeactivate(true)}>
              <PowerOff size={14} />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={toggleActiveMutation.isPending}
              onClick={() =>
                toggleActiveMutation.mutate({
                  path: { id: category.id },
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
        title='Deactivate category'
        description={`Are you sure you want to deactivate "${category.name}"? It will be hidden from the store.`}
        confirmLabel='Deactivate'
        variant='destructive'
        isLoading={toggleActiveMutation.isPending}
        onConfirm={() =>
          toggleActiveMutation.mutate({
            path: { id: category.id },
            body: { isActive: false },
          })
        }
      />

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title='Delete category'
        description={`Are you sure you want to permanently delete "${category.name}"? This action cannot be undone.`}
        confirmLabel='Delete'
        variant='destructive'
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ path: { id: category.id } })}
      />
    </>
  );
};
