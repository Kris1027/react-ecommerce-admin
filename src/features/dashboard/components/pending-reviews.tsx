import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight, MessageSquare } from 'lucide-react';

import { reviewsControllerFindAllOptions } from '@/api/generated/@tanstack/react-query.gen';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PendingReviews = () => {
  const reviewsQuery = useQuery(
    reviewsControllerFindAllOptions({
      query: { limit: '1', status: 'PENDING' },
    }),
  );

  if (reviewsQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-16 w-full' />
        </CardContent>
      </Card>
    );
  }

  const count = reviewsQuery.data?.meta?.total ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Reviews</CardTitle>
        <CardAction>
          <Button variant='ghost' size='sm' asChild>
            <Link to={'/reviews' as string}>
              View all <ArrowRight size={16} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-4'>
          <div className='bg-muted flex size-12 shrink-0 items-center justify-center rounded-full'>
            <MessageSquare size={20} />
          </div>
          <div>
            <p className='text-2xl font-bold'>{count}</p>
            <p className='text-muted-foreground text-sm'>
              {count === 1 ? 'review' : 'reviews'} awaiting moderation
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { PendingReviews };
