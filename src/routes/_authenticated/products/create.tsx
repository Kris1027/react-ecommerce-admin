import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/features/products/components/product-form';

export const Route = createFileRoute('/_authenticated/products/create')({
  component: ProductCreatePage,
});

function ProductCreatePage() {
  return (
    <div className='space-y-6'>
      <PageHeader
        title='Create Product'
        description='Add a new product to your catalog'
      >
        <Button variant='outline' asChild>
          <Link to='/products'>
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </Button>
      </PageHeader>

      <div className='max-w-2xl'>
        <ProductForm />
      </div>
    </div>
  );
}
