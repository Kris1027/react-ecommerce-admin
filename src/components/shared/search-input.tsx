import { X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onSearch: (value: string | undefined) => void;
  className?: string;
};

const SearchInput = ({
  placeholder = 'Search...',
  value,
  onSearch,
  className,
}: SearchInputProps) => {
  return (
    <div className={cn('relative w-full sm:max-w-sm', className)}>
      <Input
        key={value}
        placeholder={placeholder}
        defaultValue={value ?? ''}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch(e.currentTarget.value || undefined);
          }
        }}
        onBlur={(e) => {
          const newValue = e.target.value || undefined;
          if (newValue !== value) {
            onSearch(newValue);
          }
        }}
        className={value ? 'pr-8' : ''}
      />
      {value && (
        <button
          type='button'
          aria-label='Clear search'
          onClick={() => onSearch(undefined)}
          className='text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2'
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export { SearchInput };
