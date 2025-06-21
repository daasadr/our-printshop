"use client";

import React from 'react';
import { ProductList } from '@/components/ProductList';
import { Suspense } from 'react';
import { ProductListSkeleton } from './ProductListSkeleton';

export function ProductsPageClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Naše produkty</h1>
        {/* Placeholder pre prípadné tlačidlá alebo ďalšie info */}
      </div>
      <div className="w-full">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
} 