"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FormattedProduct } from '@/types/prisma';
import { formatPriceByLocale, detectUserCountry } from '@/utils/currency';

type LatestProductsProps = {
  limit?: number;
};

const LatestProducts: React.FC<LatestProductsProps> = ({ limit = 4 }) => {
  const { t } = useTranslation('common');
  const { locale = 'cs' } = useRouter();
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [displayed, setDisplayed] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/products`);
        if (!response.ok) {
          throw new Error(t('error.server_error', { status: response.status, statusText: response.statusText }));
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Chyba při načítání nejnovějších produktů:', error);
        setError(t('error.load_products'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestProducts();
  }, [t]);

  useEffect(() => {
    detectUserCountry().then(setCountry);
  }, []);

  const getRandomProducts = React.useCallback((arr: FormattedProduct[], n: number) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(n, arr.length));
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;
    setDisplayed(getRandomProducts(products, limit));
    const interval = setInterval(() => {
      setDisplayed(prev => {
        let newSelection;
        do {
          newSelection = getRandomProducts(products, limit);
        } while (JSON.stringify(newSelection) === JSON.stringify(prev));
        return newSelection;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [products, limit, getRandomProducts]);

  const processImageUrl = (url: string | null): string => {
    if (!url || url === '/images/placeholder.jpg') {
      return '/images/placeholder.jpg';
    }
    return url.startsWith('http') ? url : `https://${url}`;
  };

  if (isLoading) {
    return <ProductsLoading />;
  }

  if (error) {
    return <div className="text-center py-8"><p className="text-red-500">{error}</p></div>;
  }

  if (!displayed || displayed.length === 0) {
    return <ProductPlaceholders limit={limit} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayed.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link href={`/${locale}/products/${product.id}`} className="block">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
              <Image
                src={processImageUrl(product.image)}
                alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center transition-opacity duration-300 group-hover:opacity-80"
                onError={(e) => {
                  console.error(t('error.image_load', { product: product.name }), e);
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
            </div>
          </Link>
          <div className="p-4 flex flex-col flex-grow">
            <Link href={`/${locale}/products/${product.id}`} className="block">
              <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 truncate">{product.name}</h3>
            </Link>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">
                {formatPriceByLocale(product.price, locale, country || undefined)}
              </p>
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                {t('product.add_to_cart')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductsLoading: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
);

const ProductPlaceholders: React.FC<{ limit: number }> = ({ limit }) => {
    const { t } = useTranslation('common');
    const { locale = 'cs' } = useRouter();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
                <div key={i} className="group relative bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="aspect-square overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path></svg>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900">Načítání produktu...</h3>
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-lg font-medium text-gray-900">{formatPriceByLocale(0, locale)}</p>
                            <div className="px-3 py-1.5 bg-gray-400 text-white text-sm font-medium rounded-md">{t('product.add_to_cart')}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LatestProducts;