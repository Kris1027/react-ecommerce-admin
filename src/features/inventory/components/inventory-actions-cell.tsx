import { useNavigate } from '@tanstack/react-router';
import { Eye, MoreHorizontal } from 'lucide-react';

import type { StockInfoDto } from '@/api/generated/types.gen';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type InventoryActionsCellProps = {
  stock: StockInfoDto;
};

export const InventoryActionsCell = ({ stock }: InventoryActionsCellProps) => {
  const navigate = useNavigate();

  return (
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
              to: '/inventory/$productId',
              params: { productId: stock.id },
            })
          }
        >
          <Eye size={14} />
          View stock detail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
