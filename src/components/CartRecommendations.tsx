'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { useLocale } from '@/context/LocaleContext';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { FiPlus, FiHeart } from 'react-icons/fi';
import { getProductImages } from '@/utils/productImage';

interface CartRecommendationsProps {
  className?: string;
}

export default function CartRecommendations({ className = '' }: CartRecommendationsProps) {
  const { currency } = useLocale();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products/latest?limit=4');
        if (response.ok) {
          const products = await response.json();
          setRecommendations(products);
        }
      } catch (error) {
        console.warn('Failed to fetch recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleAddToCart = (product: any) => {
    const firstVariant = product.variants?.[0];
    if (firstVariant) {
      addToCart({
        variantId: firstVariant.id,
        quantity: 1,
        name: product.name,
        price: firstVariant.price,
        image: getProductImages(product).main
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Odporúčané produkty</h3>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Odporúčané produkty</h3>
      <div className="grid grid-cols-2 gap-4">
        {recommendations.map((product) => {
          const firstVariant = product.variants?.[0];
          const priceConverted = firstVariant ? convertCurrency(firstVariant.price, currency) : 0;
          
          return (
            <div key={product.id} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={getProductImages(product).main}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              
              <div className="p-3">
                <Link href={`/products/${product.id}`}>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600">
                    {product.name}
                  </h4>
                </Link>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-blue-600">
                    {formatPrice(priceConverted, currency)}
                  </p>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Pridať do košíka"
                  >
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
