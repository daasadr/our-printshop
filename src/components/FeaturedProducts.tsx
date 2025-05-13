"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPriceCZK } from '@/utils/currency';

interface Product {
  id: string;
  name: string;
  previewUrl: string;
  price: number;
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return <ProductPlaceholders />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block group"
          >
            <div className="aspect-square relative mb-4">
              <Image
                src={product.previewUrl}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">
              {product.name}
            </h3>
            <p className="text-gray-600">From {product.price} CZK</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Placeholder pro produkt, když nemáme data
const ProductPlaceholders: React.FC = () => {
  // Ukázkové produkty
  const placeholders = [
    {
      id: 'placeholder-1',
      title: 'Tričko "Minimalistický design"',
      price: 599,
    },
    {
      id: 'placeholder-2',
      title: 'Mikina "Urban Style"',
      price: 1299,
    },
    {
      id: 'placeholder-3',
      title: 'Plakát "Geometric Art"',
      price: 349,
    },
    {
      id: 'placeholder-4',
      title: 'Hrnek "Morning Coffee"',
      price: 299,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {placeholders.map((product) => (
        <div key={product.id} className="group relative">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              Obrázek produktu
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
            <p className="mt-1 text-sm text-gray-500">Více variant</p>
            <p className="mt-2 text-sm font-medium text-gray-900">{formatPriceCZK(product.price)}</p>
          </div>
          
          <div className="mt-4">
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Do košíku
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};