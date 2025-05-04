'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { formatPriceCZK } from '@/utils/currency';
import { FormattedProduct } from '@/types/prisma';

interface ProductListProps {
  products: FormattedProduct[];
}

export default function ProductList({ products }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Vše' : category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square relative">
                <Image
                  src={product.previewUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                  {product.title}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-gray-500">{product.category}</p>
              <p className="mt-2 text-lg font-medium text-gray-900">
                {formatPriceCZK(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}