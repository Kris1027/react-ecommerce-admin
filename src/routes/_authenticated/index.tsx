import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

import {
  ordersControllerGetAllOrdersOptions,
  productsControllerFindAllOptions,
  usersControllerFindAllOptions,
  paymentsControllerGetAllPaymentsOptions,
} from '@/api/generated/@tanstack/react-query.gen';
import { MoneyDisplay } from '@/components/shared/money-display';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard, StatCardSkeleton } from '@/features/dashboard';

const getTodayRange = (): { fromDate: string; toDate: string } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return {
    fromDate: start.toISOString(),
    toDate: end.toISOString(),
  };
};

const DashboardPage = () => {
  const today = getTodayRange();

  const ordersQuery = useQuery(
    ordersControllerGetAllOrdersOptions({
      query: { limit: '1' },
    }),
  );

  const todayOrdersQuery = useQuery(
    ordersControllerGetAllOrdersOptions({
      query: { limit: '1', fromDate: today.fromDate, toDate: today.toDate },
    }),
  );

  const productsQuery = useQuery(
    productsControllerFindAllOptions({
      query: { limit: 1 },
    }),
  );

  const usersQuery = useQuery(
    usersControllerFindAllOptions({
      query: { limit: '1' },
    }),
  );

  const revenueQuery = useQuery(
    paymentsControllerGetAllPaymentsOptions({
      query: { limit: '100', status: 'SUCCEEDED' },
    }),
  );

  const totalOrders = ordersQuery.data?.meta?.total;
  const todayOrders = todayOrdersQuery.data?.meta?.total;
  const totalProducts = productsQuery.data?.meta?.total;
  const totalUsers = usersQuery.data?.meta?.total;

  const totalRevenue = revenueQuery.data?.data?.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  const isLoading =
    ordersQuery.isLoading ||
    productsQuery.isLoading ||
    usersQuery.isLoading ||
    revenueQuery.isLoading;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Dashboard'
        description="Overview of your store's performance"
      />

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title='Total Orders'
              value={totalOrders ?? 0}
              description={`${todayOrders ?? 0} today`}
              icon={<ShoppingCart size={20} />}
            />
            <StatCard
              title='Revenue'
              value={<MoneyDisplay amount={totalRevenue ?? 0} />}
              description='From successful payments'
              icon={<DollarSign size={20} />}
            />
            <StatCard
              title='Products'
              value={totalProducts ?? 0}
              description='Active in catalog'
              icon={<Package size={20} />}
            />
            <StatCard
              title='Users'
              value={totalUsers ?? 0}
              description='Registered accounts'
              icon={<Users size={20} />}
            />
          </>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});
