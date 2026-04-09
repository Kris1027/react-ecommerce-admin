import { useRef, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';
import { GripVertical, Trash2, Upload, X } from 'lucide-react';

import type { ProductImageDto } from '@/api/generated/types.gen';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ImageItem =
  | { id: string; type: 'existing'; image: ProductImageDto }
  | { id: string; type: 'new'; file: File };

type SortableImageGridProps = {
  existingImages: ProductImageDto[];
  newFiles: File[];
  onReorder: (imageIds: string[]) => void;
  onNewFilesReorder: (files: File[]) => void;
  onRemoveExisting: (imageId: string) => void;
  onRemoveNew: (index: number) => void;
  onAddFiles: (files: File[]) => void;
  disabled?: boolean;
};

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp';
const DEFAULT_MAX_SIZE_MB = 5;

const previewCache = new WeakMap<File, string>();

const getOrCreatePreview = (file: File): string => {
  let url = previewCache.get(file);
  if (!url) {
    url = URL.createObjectURL(file);
    previewCache.set(file, url);
  }
  return url;
};

const buildItems = (
  existingImages: ProductImageDto[],
  newFiles: File[],
): ImageItem[] => {
  const existing: ImageItem[] = existingImages.map((image) => ({
    id: image.id,
    type: 'existing',
    image,
  }));
  const newItems: ImageItem[] = newFiles.map((file, i) => ({
    id: `new-${i}`,
    type: 'new',
    file,
  }));
  return [...existing, ...newItems];
};

type SortableImageProps = {
  item: ImageItem;
  index: number;
  isFirst: boolean;
  disabled: boolean;
  onRemove: () => void;
};

const SortableImage = ({
  item,
  index,
  isFirst,
  disabled,
  onRemove,
}: SortableImageProps) => {
  const { ref } = useSortable({ id: item.id, index, disabled });

  const src =
    item.type === 'existing' ? item.image.url : getOrCreatePreview(item.file);

  const alt =
    item.type === 'existing'
      ? typeof item.image.alt === 'string'
        ? item.image.alt
        : 'Product image'
      : item.file.name;

  return (
    <div
      ref={ref}
      className='group relative h-20 w-20 cursor-grab rounded-md border active:cursor-grabbing sm:h-24 sm:w-24'
    >
      <img
        src={src}
        alt={alt}
        className='h-full w-full rounded-md object-cover'
      />

      {isFirst && (
        <Badge className='absolute bottom-1 left-1 text-[10px]'>Main</Badge>
      )}

      <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-black/0 transition-colors group-hover:bg-black/10'>
        <GripVertical className='text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100' />
      </div>

      {!disabled && (
        <Button
          type='button'
          variant='destructive'
          size='icon'
          className='absolute -top-2 -right-2 size-6 opacity-0 transition-opacity group-hover:opacity-100'
          aria-label={`Remove image ${index + 1}`}
          onClick={onRemove}
        >
          {item.type === 'existing' ? (
            <Trash2 className='size-3' />
          ) : (
            <X className='size-3' />
          )}
        </Button>
      )}
    </div>
  );
};

const SortableImageGrid = ({
  existingImages,
  newFiles,
  onReorder,
  onNewFilesReorder,
  onRemoveExisting,
  onRemoveNew,
  onAddFiles,
  disabled = false,
}: SortableImageGridProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = buildItems(existingImages, newFiles);

  const applyReorder = (initialIndex: number, index: number) => {
    if (initialIndex === index) return;

    const reordered = [...items];
    const [removed] = reordered.splice(initialIndex, 1);
    reordered.splice(index, 0, removed);

    const reorderedExisting = reordered.filter(
      (item): item is ImageItem & { type: 'existing' } =>
        item.type === 'existing',
    );
    const reorderedNew = reordered.filter(
      (item): item is ImageItem & { type: 'new' } => item.type === 'new',
    );

    onReorder(reorderedExisting.map((item) => item.image.id));
    onNewFilesReorder(reorderedNew.map((item) => item.file));
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = DEFAULT_ACCEPT.split(',').map((t) => t.trim());
    if (!allowedTypes.includes(file.type)) {
      setError(`File type must be one of: ${allowedTypes.join(', ')}`);
      return false;
    }
    if (file.size > DEFAULT_MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${DEFAULT_MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const addFiles = (fileList: FileList) => {
    setError(null);
    const toAdd: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      if (validateFile(fileList[i])) {
        toAdd.push(fileList[i]);
      } else {
        return;
      }
    }
    if (toAdd.length > 0) onAddFiles(toAdd);
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleRemove = (item: ImageItem, index: number) => {
    if (item.type === 'existing') {
      onRemoveExisting(item.image.id);
    } else {
      const newIndex = index - existingImages.length;
      onRemoveNew(newIndex);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;
          const source = event.operation.source;
          if (!isSortable(source)) return;
          applyReorder(source.initialIndex, source.index);
        }}
      >
        <div className='flex flex-wrap gap-4'>
          {items.map((item, index) => (
            <SortableImage
              key={item.id}
              item={item}
              index={index}
              isFirst={index === 0}
              disabled={disabled}
              onRemove={() => handleRemove(item, index)}
            />
          ))}

          <div
            role='button'
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (!disabled && e.dataTransfer.files.length > 0) {
                addFiles(e.dataTransfer.files);
              }
            }}
            className={cn(
              'flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed transition-colors sm:h-24 sm:w-24',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50',
              disabled && 'pointer-events-none opacity-50',
            )}
          >
            <Upload className='text-muted-foreground size-5' />
            <p className='text-muted-foreground text-[10px]'>Add</p>
          </div>
        </div>
      </DragDropProvider>

      <input
        ref={inputRef}
        type='file'
        accept={DEFAULT_ACCEPT}
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            addFiles(e.target.files);
          }
          e.target.value = '';
        }}
        className='hidden'
      />

      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
};

export { SortableImageGrid };
