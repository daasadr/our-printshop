'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPriceCZK } from '@/utils/currency';
import { useCart } from '@/hooks/useCart';
import { ProductWithRelations } from '@/types';
import { getProductImages, getProductImageUrl } from '@/utils/productImage';

interface ProductListProps {
  products: ProductWithRelations[];
}

const fallbackImage = '/images/placeholder.jpg';

export function ProductList({ products }: ProductListProps) {
  const { addToCart } = useCart();

  // Filtrovat produkty bez názvu (např. ty, které mají jen cenu)
  const safeProducts = Array.isArray(products)
    ? products.filter((p) => typeof p.name === 'string' && p.name.trim() !== '')
    : [];

  const handleAddToCart = (product: ProductWithRelations) => {
    const firstVariant = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : null;
    const firstDesign = Array.isArray(product.designs) && product.designs.length > 0 ? product.designs[0] : null;
    if (firstVariant) {
      addToCart({
        variantId: firstVariant.id,
        quantity: 1,
        name: product.name,
        price: firstVariant.price,
        image: firstDesign?.previewUrl || ''
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {safeProducts.map((product) => {
        const firstVariant = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : null;
        const firstDesign = Array.isArray(product.designs) && product.designs.length > 0 ? product.designs[0] : null;
        return (
          <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={getProductImages(product).main}
                alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if(target.src !== fallbackImage) {
                    target.src = fallbackImage;
                  }
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
                {firstVariant ? (
                  <p className="text-lg font-medium text-gray-900">
                    {formatPriceCZK(firstVariant.price)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Cena není k dispozici
                  </p>
                )}
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`px-3 py-1.5 ${
                    firstVariant
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white text-sm font-medium rounded-md transition-colors`}
                  disabled={!firstVariant}
                >
                  Do košíku
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}