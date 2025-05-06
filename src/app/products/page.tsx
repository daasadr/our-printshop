import { Suspense } from 'react';
import { ProductList } from '@/components/ProductList';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Produkty | Our Printshop',
  description: 'Prohlédněte si naši nabídku produktů',
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Naše produkty</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  );
}