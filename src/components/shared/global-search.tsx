import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowRight,
  FolderTree,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Users,
} from 'lucide-react';

import { productsControllerFindAllAdminOptions } from '@/api/generated/@tanstack/react-query.gen';
import { ADMIN_IS_ACTIVE_FILTER } from '@/lib/constants';
import { formatMoney } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const SEARCH_TARGETS = [
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Categories', to: '/categories', icon: FolderTree },
  { label: 'Orders', to: '/orders', icon: ShoppingCart },
  { label: 'Users', to: '/users', icon: Users },
  { label: 'Coupons', to: '/coupons', icon: Tag },
  { label: 'Shipping', to: '/shipping', icon: Truck },
  { label: 'Reviews', to: '/reviews', icon: Star },
] as const;

type SearchTarget = (typeof SEARCH_TARGETS)[number];

const useDebouncedValue = (value: string, delay: number): string => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SearchTarget | null>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const isProductsSearch = selected?.label === 'Products';

  const { data: productsData, isFetching } = useQuery({
    ...productsControllerFindAllAdminOptions({
      query: {
        search: debouncedQuery,
        limit: '5',
        isActive: ADMIN_IS_ACTIVE_FILTER,
      },
    }),
    enabled: isProductsSearch && debouncedQuery.length >= 2,
  });

  const products = productsData?.data ?? [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setQuery('');
      setSelected(null);
    }
  };

  const handleBack = () => {
    setSelected(null);
    setQuery('');
  };

  const handleSelectTarget = (target: SearchTarget) => {
    setSelected(target);
    setQuery('');
  };

  const handleViewAll = () => {
    if (!selected) return;
    const trimmed = query.trim();
    navigate({
      to: selected.to,
      search: trimmed ? { search: trimmed, page: 1 } : {},
    });
    handleOpenChange(false);
  };

  const handleSelectProduct = (slug: string) => {
    navigate({
      to: '/products/$productSlug',
      params: { productSlug: slug },
    });
    handleOpenChange(false);
  };

  return (
    <>
      <Button
        variant='outline'
        onClick={() => setOpen(true)}
        aria-label='Open global search'
        className='text-muted-foreground h-9 w-full justify-start gap-2 px-3 text-sm font-normal'
      >
        <Search size={16} />
        <span className='hidden md:inline'>Search...</span>
        <kbd className='bg-muted pointer-events-none ml-auto hidden rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium select-none sm:inline-block'>
          {navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl'}K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title='Global Search'
        description='Search across all sections of the admin panel'
      >
        {selected ? (
          <SelectedSearch
            selected={selected}
            query={query}
            onQueryChange={setQuery}
            onBack={handleBack}
            isProductsSearch={isProductsSearch}
            isFetching={isFetching}
            products={products}
            debouncedQuery={debouncedQuery}
            onSelectProduct={handleSelectProduct}
            onViewAll={handleViewAll}
          />
        ) : (
          <Command>
            <CommandInput
              placeholder='What are you looking for?'
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No matching section.</CommandEmpty>
              <CommandGroup heading='Search in'>
                {SEARCH_TARGETS.map((target) => (
                  <CommandItem
                    key={target.to}
                    onSelect={() => handleSelectTarget(target)}
                  >
                    <target.icon size={16} />
                    <span>{target.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </CommandDialog>
    </>
  );
};

type SelectedSearchProps = {
  selected: SearchTarget;
  query: string;
  onQueryChange: (value: string) => void;
  onBack: () => void;
  isProductsSearch: boolean;
  isFetching: boolean;
  products: Array<{
    name: string;
    slug: string;
    price: string;
    category: { name: string };
    images: Array<{ url: string }>;
  }>;
  debouncedQuery: string;
  onSelectProduct: (slug: string) => void;
  onViewAll: () => void;
};

const SelectedSearch = ({
  selected,
  query,
  onQueryChange,
  onBack,
  isProductsSearch,
  isFetching,
  products,
  debouncedQuery,
  onSelectProduct,
  onViewAll,
}: SelectedSearchProps) => {
  const trimmed = query.trim();

  return (
    <Command shouldFilter={false}>
      <div className='flex items-center gap-2 border-b px-3 py-2'>
        <button
          type='button'
          aria-label='Back to search sections'
          onClick={onBack}
          className='text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft size={16} />
        </button>
        <selected.icon size={16} className='text-muted-foreground' />
        <span className='text-sm font-medium'>{selected.label}</span>
      </div>
      <CommandInput
        placeholder={`Search ${selected.label.toLowerCase()}...`}
        value={query}
        onValueChange={onQueryChange}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' && !query) {
            onBack();
          }
        }}
      />
      <CommandList>
        {isFetching && (
          <div className='flex items-center justify-center gap-2 py-6 text-sm'>
            <Loader2 size={16} className='animate-spin' />
            <span className='text-muted-foreground'>Searching...</span>
          </div>
        )}

        {isProductsSearch && !isFetching && debouncedQuery.length >= 2 && (
          <>
            {products.length === 0 ? (
              <CommandEmpty>
                No products found for &ldquo;{debouncedQuery}&rdquo;
              </CommandEmpty>
            ) : (
              <CommandGroup heading='Products'>
                {products.map((product) => (
                  <CommandItem
                    key={product.slug}
                    value={product.slug}
                    onSelect={() => onSelectProduct(product.slug)}
                  >
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className='size-8 rounded border object-cover'
                      />
                    ) : (
                      <div className='bg-muted flex size-8 items-center justify-center rounded border'>
                        <Package size={14} className='text-muted-foreground' />
                      </div>
                    )}
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>
                        {product.name}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {product.category.name} &middot;{' '}
                        {formatMoney(Number(product.price))}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {products.length > 0 && (
              <CommandGroup>
                <CommandItem onSelect={onViewAll}>
                  <ArrowRight size={16} />
                  <span>View all results for &ldquo;{trimmed}&rdquo;</span>
                </CommandItem>
              </CommandGroup>
            )}
          </>
        )}

        {isProductsSearch && !isFetching && debouncedQuery.length < 2 && (
          <CommandEmpty>Type at least 2 characters to search...</CommandEmpty>
        )}

        {!isProductsSearch && trimmed && (
          <CommandGroup>
            <CommandItem onSelect={onViewAll}>
              <Search size={16} />
              <span>
                Search {selected.label.toLowerCase()} for &ldquo;{trimmed}
                &rdquo;
              </span>
            </CommandItem>
          </CommandGroup>
        )}

        {!isProductsSearch && !trimmed && (
          <CommandEmpty>
            Type to search {selected.label.toLowerCase()}...
          </CommandEmpty>
        )}
      </CommandList>
    </Command>
  );
};

export { GlobalSearch };
