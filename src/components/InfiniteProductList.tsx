'use client';

import { useEffect, useRef } from 'react';
import { ProductWithRelations } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';
import { SectionLoader } from '@/components/PageLoader';
import { useLocale } from '@/context/LocaleContext';
import { useInfiniteLoading } from '@/hooks/useLoadingState';

interface InfiniteProductListProps {
  initialProducts: ProductWithRelations[];
  category?: string;
  search?: string;
  priceFrom?: string;
  priceTo?: string;
  sortBy?: string;
  exchangeRates: any;
  lang: string;
}

const PRODUCTS_PER_PAGE = 12;

export default function InfiniteProductList({
  initialProducts,
  category,
  search,
  priceFrom,
  priceTo,
  sortBy,
  exchangeRates,
  lang
}: InfiniteProductListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { currency } = useLocale();

  // Funkcia pre načítanie ďalších produktov
  const loadMoreProducts = async (page: number): Promise<ProductWithRelations[]> => {
    const apiParams = new URLSearchParams();
    apiParams.set('page', page.toString());
    apiParams.set('limit', PRODUCTS_PER_PAGE.toString());
    apiParams.set('locale', lang);

    if (category) apiParams.set('category', category);
    if (search) apiParams.set('search', search);
    if (priceFrom) apiParams.set('priceFrom', priceFrom);
    if (priceTo) apiParams.set('priceTo', priceTo);
    if (sortBy) apiParams.set('sortBy', sortBy);

    const response = await fetch(`/api/products?${apiParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to load more products');
    }

    return await response.json();
  };

  // Použitie infinite loading hook
  const {
    items: products,
    hasMore,
    isLoading,
    error,
    loadMoreItems,
    reset
  } = useInfiniteLoading(loadMoreProducts, {
    initialPage: 2, // Začneme od 2. stránky, pretože 1. už máme
    hasMore: initialProducts.length >= PRODUCTS_PER_PAGE
  });

  // Inicializácia s počiatočnými produktmi
  useEffect(() => {
    reset();
  }, [category, search, priceFrom, priceTo, sortBy, reset]);

  // Intersection Observer pre infinite scroll
  useEffect(() => {
    if (!loadingRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreItems, hasMore, isLoading]);

  // Kombinácia počiatočných a načítaných produktov
  const allProducts = [...initialProducts, ...products];

  // Error state s retry
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chyba pri načítaní</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
        <button
          onClick={loadMoreItems}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Načítavam...
            </>
          ) : (
            'Skúsiť znova'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid produktov */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading indicator pre infinite scroll */}
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center py-8">
          {isLoading ? (
            <div className="text-center">
              <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-3" />
              <p className="text-gray-600 text-sm animate-pulse">Načítavam ďalšie produkty...</p>
            </div>
          ) : (
            <div className="h-8" /> // Invisible element pre observer
          )}
        </div>
      )}

      {/* End of products message */}
      {!hasMore && allProducts.length > 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600">Všetky produkty boli načítané</p>
        </div>
      )}

      {/* No products message */}
      {!hasMore && allProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Žiadne produkty nenájdené</h3>
          <p className="text-gray-600">
            {category 
              ? `V kategórii "${category}" neboli nájdené žiadne produkty.`
              : 'Momentálne nie sú k dispozícii žiadne produkty.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
