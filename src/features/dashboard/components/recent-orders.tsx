import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { ordersControllerGetAllOrdersOptions } from '@/api/generated/@tanstack/react-query.gen';
import { MoneyDisplay } from '@/components/shared/money-display';
import { StatusBadge } from '@/components/shared/status-badge';
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

import { ORDER_STATUS_MAP } from './order-status-map';

const RecentOrders = () => {
  const ordersQuery = useQuery(
    ordersControllerGetAllOrdersOptions({
      query: { limit: '5', sortBy: 'createdAt', sortOrder: 'desc' },
    }),
  );

  if (ordersQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Last 5 orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const orders = ordersQuery.data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Last 5 orders</CardDescription>
        <CardAction>
          <Button variant='ghost' size='sm' asChild>
            <Link to={'/orders' as string}>
              View all <ArrowRight size={16} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='font-medium'>
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={order.status}
                    statusMap={ORDER_STATUS_MAP}
                  />
                </TableCell>
                <TableCell className='text-right'>
                  <MoneyDisplay amount={Number(order.total)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { RecentOrders };
