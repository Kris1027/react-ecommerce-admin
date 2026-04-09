import { useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ImageUploadProps = {
  value: Array<File | string>;
  onChange: (files: Array<File | string>) => void;
  maxFiles?: number;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
};

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp';
const DEFAULT_MAX_SIZE_MB = 5;

const ImageUpload = ({
  value,
  onChange,
  maxFiles,
  accept = DEFAULT_ACCEPT,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  disabled = false,
}: ImageUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cleanupRef = useRef<Map<File, string>>(new Map());

  // Adjust preview state when value prop changes (React-endorsed render-time pattern)
  const [prevValue, setPrevValue] = useState(value);
  const [filePreviews, setFilePreviews] = useState<Map<File, string>>(
    new Map(),
  );

  if (value !== prevValue) {
    setPrevValue(value);

    const nextPreviews = new Map<File, string>();
    for (const item of value) {
      if (item instanceof File) {
        const existing = filePreviews.get(item);
        nextPreviews.set(item, existing ?? URL.createObjectURL(item));
      }
    }

    for (const [file, url] of filePreviews) {
      if (!nextPreviews.has(file)) {
        URL.revokeObjectURL(url);
      }
    }

    setFilePreviews(nextPreviews);
  }

  // Keep ref in sync for unmount cleanup (ref written in effect, not render)
  useEffect(() => {
    cleanupRef.current = filePreviews;
  }, [filePreviews]);

  useEffect(() => {
    return () => {
      for (const url of cleanupRef.current.values()) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const getPreviewSrc = (item: File | string): string | undefined => {
    if (typeof item === 'string') return item;
    return filePreviews.get(item);
  };

  const canAddMore = !maxFiles || value.length < maxFiles;

  const validateFile = (file: File): boolean => {
    const allowedTypes = accept.split(',').map((t) => t.trim());
    if (!allowedTypes.includes(file.type)) {
      setError(`File type must be one of: ${allowedTypes.join(', ')}`);
      return false;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const addFiles = (files: FileList) => {
    setError(null);
    const remaining = maxFiles ? maxFiles - value.length : files.length;
    const toAdd: File[] = [];

    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i];
      if (validateFile(file)) {
        toAdd.push(file);
      } else {
        return;
      }
    }

    if (toAdd.length > 0) {
      onChange([...value, ...toAdd]);
    }
  };

  const handleRemove = (index: number) => {
    setError(null);
    onChange(value.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap gap-4'>
        {value.map((item, index) => {
          const src = getPreviewSrc(item);
          return (
            <div
              key={`${typeof item === 'string' ? item : item.name}-${index}`}
              className='relative'
            >
              <img
                src={src}
                alt='Upload preview'
                className='h-32 w-32 rounded-md border object-cover sm:h-40 sm:w-40'
              />
              {!disabled && (
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='absolute -top-2 -right-2 size-6'
                  onClick={() => handleRemove(index)}
                >
                  <X className='size-4' />
                </Button>
              )}
            </div>
          );
        })}

        {canAddMore && (
          <div
            role='button'
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick();
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed transition-colors sm:h-40 sm:w-40',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50',
              disabled && 'pointer-events-none opacity-50',
            )}
          >
            <Upload className='text-muted-foreground size-8' />
            <p className='text-muted-foreground text-xs'>
              Click or drag to upload
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        multiple={!maxFiles || maxFiles > 1}
        onChange={handleFileChange}
        className='hidden'
      />

      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
};

export { ImageUpload };
