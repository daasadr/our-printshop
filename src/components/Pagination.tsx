'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';

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
  
  // Funkce pro vytvoření URL s parametry
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  // Funkce pro vytvoření URL pro kategorii
  const createCategoryUrl = (page: number) => {
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    if (page > 1) {
      params.set('page', page.toString());
    }
    return `?${params.toString()}`;
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
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Předchozí stránka */}
      {currentPage > 1 && (
        <Link
          href={category ? createCategoryUrl(currentPage - 1) : createPageUrl(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
        >
          {dictionary?.pagination?.previous || 'Předchozí'}
        </Link>
      )}

      {/* První stránka */}
      {startPage > 1 && (
        <>
          <Link
            href={category ? createCategoryUrl(1) : createPageUrl(1)}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
          >
            1
          </Link>
          {startPage > 2 && (
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
          )}
        </>
      )}

      {/* Stránky */}
      {pages.map((page) => (
        <Link
          key={page}
          href={category ? createCategoryUrl(page) : createPageUrl(page)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            page === currentPage
              ? 'bg-blue-600 text-white border border-blue-600'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Poslední stránka */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
          )}
          <Link
            href={category ? createCategoryUrl(totalPages) : createPageUrl(totalPages)}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Následující stránka */}
      {currentPage < totalPages && (
        <Link
          href={category ? createCategoryUrl(currentPage + 1) : createPageUrl(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
        >
          {dictionary?.pagination?.next || 'Následující'}
        </Link>
      )}
    </div>
  );
} 