'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { useCart } from '@/hooks/useCart';
import { ProductWithRelations } from '@/types';
import { getProductImages } from '@/utils/productImage';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/context/LocaleContext';

interface ProductListProps {
  products: ProductWithRelations[];
}

const fallbackImage = '/images/placeholder.jpg';

export function ProductList({ products }: ProductListProps) {
  const { addToCart } = useCart();
  const { currency } = useLocale();

  // Filtrovat produkty bez názvu (např. ty, které mají jen cenu)
  const safeProducts = Array.isArray(products)
    ? products.filter((p) => typeof p.name === 'string' && p.name.trim() !== '')
    : [];

  const handleAddToCart = (product: ProductWithRelations) => {
    const firstVariant = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : null;
    const firstDesign = Array.isArray(product.designs) && product.designs.length > 0 ? product.designs[0] : null;
    if (firstVariant) {
      // Převedeme cenu na správnou měnu pro košík
      const priceConverted = convertCurrency(firstVariant.price, currency);
      addToCart({
        variantId: firstVariant.id,
        quantity: 1,
        name: product.name,
        price: priceConverted,
        image: firstDesign?.previewUrl || ''
      });
    }
  };

  if (!safeProducts.length) {
    return <div className="text-center text-gray-500">Žádné produkty k zobrazení.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {safeProducts.map((product) => {
        const firstVariant = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : null;
        const firstDesign = Array.isArray(product.designs) && product.designs.length > 0 ? product.designs[0] : null;
        const priceConverted = firstVariant ? convertCurrency(firstVariant.price, currency) : 0;
        
        return (
          <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={getProductImages(product).main || fallbackImage}
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
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.description || 'Bez popisu'}
            </p>
            <div className="mt-4 flex justify-between items-center">
              {priceConverted > 0 ? (
                <p className="text-lg font-medium text-gray-900">
                  {formatPrice(priceConverted, currency)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Cena není k dispozici
                </p>
              )}
              <Button
                onClick={() => handleAddToCart(product)}
                variant={firstVariant ? "primary" : "secondary"}
                size="sm"
                disabled={!firstVariant}
              >
                Do košíku
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}