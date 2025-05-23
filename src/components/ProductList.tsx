'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FormattedProduct } from '@/types/prisma';
import prisma from '@/lib/prisma';
import { convertEurToCzk } from '@/lib/currency';
import { formatPriceCZK } from '@/utils/currency';
import { useCart } from '@/hooks/useCart';

async function getProducts(category?: string): Promise<FormattedProduct[]> {
  const include = {
    variants: {
      where: { isActive: true },
      orderBy: { price: 'asc' },
    },
    designs: true,
    categories: { include: { category: true } },
  };

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include,
  });

  // Filtrace podle kategorie (pokud je zadána)
  let filteredProducts = products;
  if (category) {
    filteredProducts = products.filter(product =>
      product.categories.some(pc => pc.categoryId === category)
    );
  }

  // Mapování na výstup
  return await Promise.all(filteredProducts.map(async (product) => {
    const basePrice = product.variants[0]?.price || 0;
    const convertedPrice = await convertEurToCzk(basePrice);
    const convertedVariants = await Promise.all(product.variants.map(async (variant) => ({
      ...variant,
      price: await convertEurToCzk(variant.price),
    })));
    return {
      ...product,
      previewUrl: product.designs[0]?.previewUrl || '',
      price: convertedPrice,
      categories: product.categories.map(pc => pc.category.name),
      categoryIds: product.categories.map(pc => pc.categoryId),
      variants: convertedVariants,
      designs: product.designs.map(({ productId: _productId, ...design }) => design),
    } as FormattedProduct;
  }));
}

interface ProductListProps {
  products: FormattedProduct[];
}

export function ProductList({ products }: ProductListProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: FormattedProduct) => {
    if (product.variants && product.variants.length > 0) {
      addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        name: product.name,
        price: product.price,
        image: product.previewUrl || ''
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={product.previewUrl || '/images/placeholder.jpg'}
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
              {product.price > 0 ? (
                <p className="text-lg font-medium text-gray-900">
                  {formatPriceCZK(product.price)}
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