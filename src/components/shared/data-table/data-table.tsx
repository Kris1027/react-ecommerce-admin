import type { ReactNode } from 'react';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { PaginationMeta } from '@/api/generated/types.gen';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTableContext } from './data-table-context';
import type { DataTableContextValue, DataTableState } from './types';

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  meta?: PaginationMeta;
  state: DataTableState;
  onStateChange: (state: DataTableState) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  children?: ReactNode;
};

const DataTable = <TData,>({
  columns,
  data,
  meta,
  state,
  onStateChange,
  isLoading = false,
  emptyMessage = 'No results found.',
  children,
}: DataTableProps<TData>) => {
  const sorting: SortingState = state.sortBy
    ? [{ id: state.sortBy, desc: state.sortOrder === 'desc' }]
    : [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta?.totalPages ?? -1,
    manualSorting: true,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater;
      const sort = newSorting[0];
      onStateChange({
        ...state,
        page: 1,
        sortBy: sort?.id,
        sortOrder: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
      });
    },
    state: {
      sorting,
      pagination: {
        pageIndex: state.page - 1,
        pageSize: state.limit,
      },
    },
  });

  return (
    <DataTableContext
      value={
        {
          table,
          meta,
          state,
          onStateChange,
          isLoading,
        } as DataTableContextValue<unknown>
      }
    >
      <div className='flex flex-col gap-4'>
        {children}

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DataTableContext>
  );
};

export { DataTable };
