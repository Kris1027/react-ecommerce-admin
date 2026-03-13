import { createContext, use } from 'react';

import type { DataTableContextValue } from './types';

const DataTableContext = createContext<DataTableContextValue<unknown> | null>(
  null,
);

const useDataTable = <TData>() => {
  const context = use(DataTableContext);
  if (!context) {
    throw new Error('useDataTable must be used within a DataTable');
  }
  return context as DataTableContextValue<TData>;
};

export { DataTableContext, useDataTable };
