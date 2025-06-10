'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPriceCZK } from '@/utils/currency';
import { useCart } from '@/hooks/useCart';
import { ProductWithRelations } from '@/types';

interface ProductListProps {
  products: ProductWithRelations[];
}

export function ProductList({ products }: ProductListProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: ProductWithRelations) => {
    if (product.variants && product.variants.length > 0) {
      addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        name: product.name,
        price: product.variants[0].price,
        image: product.designs[0]?.previewUrl || ''
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={product.designs[0]?.previewUrl || '/images/placeholder.jpg'}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center group-hover:opacity-75"
              onError={(e) => {
                console.error(`Chyba při načítání obrázku pro produkt ${product.name}:`, e);
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
            />
          </div>
         
          <div className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                {product.name}
              </h3>
            </Link>
            
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
            
            <div className="mt-4 flex justify-between items-center">
              {product.variants && product.variants.length > 0 ? (
                <p className="text-lg font-medium text-gray-900">
                  {formatPriceCZK(product.variants[0].price)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Cena není k dispozici
                </p>
              )}
              
              <button
                onClick={() => handleAddToCart(product)}
                className={`px-3 py-1.5 ${
                  product.variants && product.variants.length > 0 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white text-sm font-medium rounded-md transition-colors`}
                disabled={!product.variants || product.variants.length === 0}
              >
                Do košíku
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}