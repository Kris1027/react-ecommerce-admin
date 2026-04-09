import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import {
  inventoryControllerAdjustStockMutation,
  inventoryControllerGetLowStockProductsQueryKey,
  inventoryControllerGetMovementHistoryQueryKey,
  inventoryControllerGetProductsQueryKey,
  inventoryControllerGetStockQueryKey,
  productsControllerFindAllAdminQueryKey,
  productsControllerFindAllQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';
import { FormField } from '@/components/shared/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const ADJUSTMENT_TYPES = ['ADJUSTMENT', 'RESTOCK', 'RETURN'] as const;

const adjustStockSchema = z.object({
  quantity: z
    .number({ error: 'Quantity is required' })
    .int('Must be a whole number')
    .refine((v) => v !== 0, 'Quantity cannot be zero'),
  type: z.enum(ADJUSTMENT_TYPES),
  reason: z.string().max(500, 'Reason too long').optional(),
});

type AdjustStockFormValues = z.infer<typeof adjustStockSchema>;

type AdjustStockFormProps = {
  productId: string;
};

export const AdjustStockForm = ({ productId }: AdjustStockFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<AdjustStockFormValues>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      quantity: undefined,
      type: 'ADJUSTMENT',
      reason: '',
    },
  });

  const type = useWatch({ control, name: 'type' });

  const adjustMutation = useMutation({
    ...inventoryControllerAdjustStockMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryControllerGetStockQueryKey({
          path: { productId },
        }),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryControllerGetMovementHistoryQueryKey({
          path: { productId },
        }),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryControllerGetLowStockProductsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryControllerGetProductsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: productsControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: productsControllerFindAllAdminQueryKey(),
      });
      reset();
      toast.success('Stock adjusted');
    },
  });

  const onSubmit = (values: AdjustStockFormValues) => {
    adjustMutation.mutate({
      path: { productId },
      body: {
        quantity: values.quantity,
        type: values.type,
        reason: values.reason || undefined,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adjust Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            label='Type'
            name='type'
            error={errors.type?.message}
            required
          >
            <Select
              value={type}
              onValueChange={(value) =>
                setValue('type', value as AdjustStockFormValues['type'], {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger id='type'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label='Quantity'
            name='quantity'
            error={errors.quantity?.message}
            required
            description='Positive to add, negative to remove'
          >
            <Input
              id='quantity'
              type='number'
              {...register('quantity', {
                setValueAs: (v: string) => {
                  const n = Number(v);
                  return v === '' || Number.isNaN(n) ? undefined : n;
                },
              })}
            />
          </FormField>

          <FormField
            label='Reason'
            name='reason'
            error={errors.reason?.message}
            description='Optional note for audit trail'
          >
            <Textarea id='reason' rows={3} {...register('reason')} />
          </FormField>

          <Button type='submit' disabled={adjustMutation.isPending}>
            {adjustMutation.isPending ? 'Adjusting...' : 'Adjust Stock'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
