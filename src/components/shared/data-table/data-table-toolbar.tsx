import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ReactNode } from 'react';

type DataTableToolbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
};

const DEBOUNCE_MS = 300;

const DataTableToolbar = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
}: DataTableToolbarProps) => {
  const [localValue, setLocalValue] = useState(searchValue);

  useEffect(() => {
    setLocalValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (localValue === searchValue) return;

    const timer = setTimeout(() => {
      onSearchChange?.(localValue);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [localValue, onSearchChange, searchValue]);

  return (
    <div className="flex items-center gap-2">
      {onSearchChange && (
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder={searchPlaceholder}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="pl-8"
          />
          {localValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-6 -translate-y-1/2"
              onClick={() => {
                setLocalValue('');
                onSearchChange('');
              }}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export { DataTableToolbar };
