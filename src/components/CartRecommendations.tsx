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
import { getDictionary } from '@/lib/getDictionary';

interface CartRecommendationsProps {
  className?: string;
}

export default function CartRecommendations({ className = '' }: CartRecommendationsProps) {
  const { currency, locale } = useLocale();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dictionary, setDictionary] = useState<any>(null);

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await getDictionary(locale);
        setDictionary(dict);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };
    loadDictionary();
  }, [locale]);

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
        image: getProductImages(product).main,
        sourceCurrency: 'EUR'
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">
          {dictionary?.cart?.recommendations?.title || 'Odporúčané produkty'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-white/20 rounded-lg mb-2" />
              <div className="h-4 bg-white/20 rounded w-3/4 mb-1" />
              <div className="h-3 bg-white/20 rounded w-1/2" />
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
      <h3 className="text-lg font-semibold text-white mb-4">
        {dictionary?.cart?.recommendations?.title || 'Odporúčané produkty'}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {recommendations.map((product) => {
          const firstVariant = product.variants?.[0];
          const priceConverted = firstVariant ? convertCurrency(firstVariant.price, currency) : 0;
          
          return (
            <div key={product.id} className="group relative bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden hover:shadow-lg hover:bg-white/20 transition-all">
              <Link href={`/${locale}/products/${product.id}`}>
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
                <Link href={`/${locale}/products/${product.id}`}>
                  <h4 className="text-sm font-medium text-white mb-1 line-clamp-2 hover:text-green-300 transition-colors">
                    {product.name}
                  </h4>
                </Link>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-green-300">
                    {formatPrice(priceConverted, currency)}
                  </p>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-1.5 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
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
