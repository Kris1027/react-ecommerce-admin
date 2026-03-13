import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { useDataTable } from './data-table-context';

const DataTableViewOptions = () => {
  const { table } = useDataTable();

  const toggleableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <Settings2 className="size-4" />
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-2">
        <p className="text-muted-foreground mb-1 px-1 text-xs font-medium">
          Toggle columns
        </p>
        <Separator className="mb-1" />
        {toggleableColumns.map((column) => (
          <button
            key={column.id}
            onClick={() => column.toggleVisibility()}
            className="hover:bg-accent flex w-full items-center gap-2 rounded-sm px-1 py-1.5 text-sm"
          >
            <div
              className={
                column.getIsVisible()
                  ? 'bg-primary border-primary text-primary-foreground flex size-4 items-center justify-center rounded-sm border'
                  : 'flex size-4 items-center justify-center rounded-sm border opacity-50'
              }
            >
              {column.getIsVisible() && (
                <svg
                  className="size-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="capitalize">{column.id}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export { DataTableViewOptions };
