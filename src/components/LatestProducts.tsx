'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { getProductImages } from '@/utils/productImage';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/context/LocaleContext';

const fallbackImage = '/images/placeholder.jpg';

interface LatestProductsProps {
  products?: any[];
  dictionary?: any;
  lang?: string;
}

const LatestProducts: React.FC<LatestProductsProps> = ({ products = [], dictionary, lang = 'cs' }) => {
  const { addToCart } = useCart();
  const { currency } = useLocale();

  // Přepočítáme ceny produktů podle aktuální měny
  const productsWithConvertedPrices = useMemo(() => {
    return products.map(product => {
      const priceEur = product.price || product.variants?.[0]?.price || 0;
      const priceConverted = convertCurrency(priceEur, currency);
      return {
        ...product,
        convertedPrice: priceConverted
      };
    });
  }, [products, currency]);

  const handleAddToCart = (product: any) => {
    if (product.variants && product.variants.length > 0) {
      // Převedeme cenu na správnou měnu pro košík
      const priceEur = product.price || product.variants?.[0]?.price || 0;
      const priceConverted = convertCurrency(priceEur, currency);
      addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        name: product.name,
        price: priceConverted,
        image: product.designs && product.designs.length > 0 ? product.designs[0].previewUrl : ''
      });
    }
  };

  if (!products || products.length === 0) {
    return <ProductPlaceholders dictionary={dictionary} currency={currency} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {productsWithConvertedPrices.map((product) => {
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
                  if (target.src !== '/images/placeholder.jpg') {
                    target.src = '/images/placeholder.jpg';
                  }
                }}
              />
            </div>
            
            <div className="p-4">
              <Link href={`/${lang}/products/${product.id}`}>
                <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>
              
              <div className="mt-4 flex justify-between items-center">
                {product.convertedPrice > 0 ? (
                  <p className="text-lg font-medium text-gray-900">
                    {formatPrice(product.convertedPrice, currency)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {dictionary?.product?.price_not_available || "Cena není k dispozici"}
                  </p>
                )}
                
                <Button
                  onClick={() => handleAddToCart(product)}
                  variant={product.variants && product.variants.length > 0 ? "primary" : "secondary"}
                  size="sm"
                  disabled={!product.variants || product.variants.length === 0}
                >
                  {dictionary?.product?.add_to_cart || "Do košíku"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProductsLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

interface ProductPlaceholdersProps {
  dictionary?: any;
  currency?: string;
}

const ProductPlaceholders: React.FC<ProductPlaceholdersProps> = ({ dictionary, currency = 'CZK' }) => {
  const placeholders = [
    { id: 'placeholder-1', name: 'Tričko "Minimalistický design"', price: 599, },
    { id: 'placeholder-2', name: 'Mikina "Urban Style"', price: 1299, },
    { id: 'placeholder-3', name: 'Plakát "Geometric Art"', price: 349, },
    { id: 'placeholder-4', name: 'Hrnek "Morning Coffee"', price: 299, },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {placeholders.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md">
          <div className="aspect-square overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              Obrázek produktu
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">Více variant</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-medium text-gray-900">
                {formatPrice(product.price, currency as any)}
              </p>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                {dictionary?.product?.add_to_cart || "Do košíku"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestProducts;