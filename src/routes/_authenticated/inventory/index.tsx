import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod/v4';

import { inventoryControllerGetProductsOptions } from '@/api/generated/@tanstack/react-query.gen';
import { useDocumentTitle } from '@/hooks/use-document-title';
import {
  DataTable,
  DataTablePagination,
  DataTableSkeleton,
} from '@/components/shared/data-table';
import { PageHeader } from '@/components/shared/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { columns } from '@/features/inventory/components/inventory-columns';

const INVENTORY_FILTERS = ['all', 'low-stock'] as const;

const inventorySearchSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  limit: z.coerce.number().int().positive().default(10).catch(10),
  sortBy: z.string().optional().catch(undefined),
  sortOrder: z.enum(['asc', 'desc']).optional().catch(undefined),
  filter: z.enum(INVENTORY_FILTERS).optional().catch(undefined),
});

export const Route = createFileRoute('/_authenticated/inventory/')({
  validateSearch: inventorySearchSchema,
  component: InventoryPage,
});

function InventoryPage() {
  useDocumentTitle('Inventory');
  const search = Route.useSearch();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    ...inventoryControllerGetProductsOptions({
      query: {
        page: String(search.page),
        limit: String(search.limit),
        sortBy: search.sortBy,
        sortOrder: search.sortOrder,
        filter: search.filter,
      },
    }),
    placeholderData: keepPreviousData,
  });

  const handleStateChange = (state: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    navigate({
      to: '/inventory',
      search: {
        ...state,
        filter: search.filter,
      },
    });
  };

  const handleFilterChange = (value: string) => {
    navigate({
      to: '/inventory',
      search: {
        ...search,
        filter:
          value === 'all'
            ? undefined
            : (value as (typeof INVENTORY_FILTERS)[number]),
        page: 1,
      },
    });
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Inventory'
        description='Monitor stock levels and manage inventory'
      />

      <div className='flex items-center gap-4'>
        <Select
          value={search.filter ?? 'all'}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='All products' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All products</SelectItem>
            <SelectItem value='low-stock'>Low stock only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && !data ? (
        <DataTableSkeleton columnCount={8} rowCount={search.limit} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          meta={data?.meta}
          state={search}
          onStateChange={handleStateChange}
        >
          <DataTablePagination />
        </DataTable>
      )}
    </div>
  );
}
