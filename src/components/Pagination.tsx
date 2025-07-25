'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  productsPerPage: number;
  category?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalProducts, 
  productsPerPage,
  category 
}: PaginationProps) {
  const searchParams = useSearchParams();
  const params = useParams();
  const [dictionary, setDictionary] = useState<any>(null);
  
  // Načtení dictionary pro aktuální jazyk
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const lang = params.lang as string;
        const dict = await import(`../../public/locales/${lang}/common.json`);
        setDictionary(dict.default);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };

    loadDictionary();
  }, [params.lang]);
  
  // Funkce pro vytvoření URL s parametry (zachová všetky existujúce parametre)
  const createPageUrl = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', page.toString());
    return `?${newParams.toString()}`;
  };

  // Funkce pro vytvoření URL pro kategorii (zachová všetky existujúce parametre)
  const createCategoryUrl = (page: number) => {
    const newParams = new URLSearchParams();
    
    // Zachová všetky existujúce parametre
    if (category) newParams.set('category', category);
    if (searchParams.get('search')) newParams.set('search', searchParams.get('search')!);
    if (searchParams.get('priceFrom')) newParams.set('priceFrom', searchParams.get('priceFrom')!);
    if (searchParams.get('priceTo')) newParams.set('priceTo', searchParams.get('priceTo')!);
    if (searchParams.get('sortBy')) newParams.set('sortBy', searchParams.get('sortBy')!);
    
    if (page > 1) {
      newParams.set('page', page.toString());
    }
    return `?${newParams.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  // Počet viditelných stránek
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-gray-700">
        {dictionary?.pagination?.showing || 'Zobrazeno'} {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} {dictionary?.pagination?.of || 'z'} {totalProducts} {dictionary?.pagination?.products || 'produktů'}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Předchozí stránka */}
        {currentPage > 1 && (
          <Link
            href={category ? createCategoryUrl(currentPage - 1) : createPageUrl(currentPage - 1)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FiChevronLeft className="w-4 h-4 mr-1" />
            {dictionary?.pagination?.previous || 'Předchozí'}
          </Link>
        )}

        {/* Čísla stránek */}
        {startPage > 1 && (
          <>
            <Link
              href={category ? createCategoryUrl(1) : createPageUrl(1)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              1
            </Link>
            {startPage > 2 && (
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Link
            key={page}
            href={category ? createCategoryUrl(page) : createPageUrl(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            )}
            <Link
              href={category ? createCategoryUrl(totalPages) : createPageUrl(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Následující stránka */}
        {currentPage < totalPages && (
          <Link
            href={category ? createCategoryUrl(currentPage + 1) : createPageUrl(currentPage + 1)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {dictionary?.pagination?.next || 'Následující'}
            <FiChevronRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
} 