import type { ReactNode } from 'react';

import { Label } from '@/components/ui/label';

type FormFieldProps = {
  label: string;
  name: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
};

const FormField = ({
  label,
  name,
  error,
  description,
  required = false,
  children,
}: FormFieldProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor={name}>
        {label}
        {required && <span className='text-destructive ml-1'>*</span>}
      </Label>

      {children}

      {description && !error && (
        <p className='text-muted-foreground text-sm'>{description}</p>
      )}

      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
};

export { FormField };
