import { useQuery } from '@tanstack/react-query';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { paymentsControllerGetAllPaymentsOptions } from '@/api/generated/@tanstack/react-query.gen';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type DailyRevenue = {
  date: string;
  revenue: number;
};

const buildLast30Days = (): Map<string, number> => {
  const days = new Map<string, number>();
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    days.set(date.toISOString().split('T')[0], 0);
  }
  return days;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(value);
};

const RevenueChart = () => {
  const paymentsQuery = useQuery(
    paymentsControllerGetAllPaymentsOptions({
      query: { limit: '100', status: 'SUCCEEDED' },
    }),
  );

  const chartData: DailyRevenue[] = (() => {
    const days = buildLast30Days();

    if (paymentsQuery.data?.data) {
      for (const payment of paymentsQuery.data.data) {
        const date = new Date(payment.createdAt).toISOString().split('T')[0];
        if (days.has(date)) {
          days.set(date, (days.get(date) ?? 0) + Number(payment.amount));
        }
      }
    }

    return Array.from(days, ([date, revenue]) => ({ date, revenue }));
  })();

  if (paymentsQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-75 w-full' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
            <XAxis
              dataKey='date'
              tickFormatter={formatDate}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              formatter={(value) => [
                formatCurrency(Number(value ?? 0)),
                'Revenue',
              ]}
              labelFormatter={(label) => formatDate(String(label))}
            />
            <Line
              type='monotone'
              dataKey='revenue'
              className='stroke-chart-1'
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export { RevenueChart };
