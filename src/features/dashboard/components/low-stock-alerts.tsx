import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { AlertTriangle, ArrowRight } from 'lucide-react';

import { inventoryControllerGetLowStockProductsOptions } from '@/api/generated/@tanstack/react-query.gen';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const LowStockAlerts = () => {
  const lowStockQuery = useQuery(
    inventoryControllerGetLowStockProductsOptions({
      query: { limit: '5' },
    }),
  );

  if (lowStockQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Products below threshold</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const products = lowStockQuery.data?.data ?? [];

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Products below threshold</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            All products are well stocked.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
        <CardDescription>Products below threshold</CardDescription>
        <CardAction>
          <Button variant='ghost' size='sm' asChild>
            <Link to={'/inventory' as string}>
              View all <ArrowRight size={16} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className='text-right'>Stock</TableHead>
              <TableHead className='text-right'>Threshold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className='font-medium'>{product.name}</TableCell>
                <TableCell className='text-right'>
                  <span className='flex items-center justify-end gap-1 text-destructive'>
                    <AlertTriangle size={14} />
                    {product.availableStock}
                  </span>
                </TableCell>
                <TableCell className='text-muted-foreground text-right'>
                  {product.lowStockThreshold}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { LowStockAlerts };
