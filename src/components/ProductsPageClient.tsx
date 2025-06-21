"use client";

import React, { useState } from 'react';
import { ProductList } from '@/components/ProductList';
import { Suspense } from 'react';
import { ProductListSkeleton } from './ProductListSkeleton';
import { useTranslation } from 'next-i18next';

export function ProductsPageClient() {
  const { t } = useTranslation('common');
  const [sortOrder, setSortOrder] = useState('default');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Naše produkty</h1>
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-order" className="text-sm font-medium text-gray-600">{t('sort_by')}:</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="default">{t('sort_default')}</option>
            <option value="price_asc">{t('sort_price_asc')}</option>
            <option value="price_desc">{t('sort_price_desc')}</option>
            <option value="name_asc">{t('sort_name_asc')}</option>
          </select>
        </div>
      </div>
      <div className="w-full">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList sortOrder={sortOrder} />
        </Suspense>
      </div>
    </div>
  );
} 