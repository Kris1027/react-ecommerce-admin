import type { PaginationMeta } from '@/api/generated/types.gen';

type DataTableState = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

type DataTableContextValue<TData> = {
  table: import('@tanstack/react-table').Table<TData>;
  meta?: PaginationMeta;
  state: DataTableState;
  onStateChange: (state: DataTableState) => void;
  isLoading: boolean;
};

export type { DataTableState, DataTableContextValue };
