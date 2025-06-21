import { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductsPageClient } from '@/components/ProductsPageClient';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';

export const metadata: Metadata = {
  title: 'Produkty | Our Printshop',
  description: 'Prohlédněte si naši nabídku produktů',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductsPageClient />
    </Suspense>
  );
}