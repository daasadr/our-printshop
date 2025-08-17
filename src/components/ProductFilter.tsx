'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { FiFilter, FiX } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';

interface ProductFilterProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
  dictionary?: any;
}

export default function ProductFilter({ categories = [], dictionary }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { locale } = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // State pre filtre
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceFrom, setPriceFrom] = useState(searchParams.get('priceFrom') || '');
  const [priceTo, setPriceTo] = useState(searchParams.get('priceTo') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Aplikovanie filtrov
  const applyFilters = () => {
    const newParams = new URLSearchParams();
    
    if (searchTerm) newParams.set('search', searchTerm);
    if (selectedCategory) newParams.set('category', selectedCategory);
    if (priceFrom) newParams.set('priceFrom', priceFrom);
    if (priceTo) newParams.set('priceTo', priceTo);
    if (sortBy) newParams.set('sort', sortBy);
    
    const queryString = newParams.toString();
    const url = `/${locale}/products${queryString ? `?${queryString}` : ''}`;
    router.push(url);
    setIsFilterOpen(false);
  };

  // Reset filtrov
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceFrom('');
    setPriceTo('');
    setSortBy('');
    router.push(`/${locale}/products`);
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
      {/* Hlavný riadok s filtrami */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {dictionary?.product_filter_title || "Filter produktov"}
        </h2>
        
        {/* Filter tlačidlo */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <FiFilter className="w-5 h-5" />
            <span>{dictionary?.product_filter_title || "Filtre"}</span>
          </button>

          {/* Dropdown filtre */}
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                {/* Kategória */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dictionary?.category || "Kategória"}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{dictionary?.all_categories || "Všetky kategórie"}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cena */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary?.price_from || "Cena od"}
                    </label>
                    <input
                      type="number"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                      placeholder={dictionary?.min_placeholder || "Min"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary?.price_to || "Cena do"}
                    </label>
                    <input
                      type="number"
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                      placeholder={dictionary?.max_placeholder || "Max"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Zoradenie */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dictionary?.sort_by || "Zoradiť podľa"}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{dictionary?.sort_default || "Predvolené"}</option>
                    <option value="price_asc">{dictionary?.sort_price_asc || "Ceny: od najlacnejších"}</option>
                    <option value="price_desc">{dictionary?.sort_price_desc || "Ceny: od najdrahších"}</option>
                    <option value="name_asc">{dictionary?.sort_name_asc || "Názvu: A-Z"}</option>
                  </select>
                </div>

                {/* Tlačidlá */}
                <div className="flex gap-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {dictionary?.show_results || "Zobraziť výsledky"}
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    {dictionary?.reset_filters || "Reset"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Aktívne filtre (ak sú) */}
      {(searchTerm || selectedCategory || priceFrom || priceTo || sortBy) && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {dictionary?.search_placeholder || "Hľadať"}: {searchTerm}
            </span>
          )}
          {selectedCategory && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {dictionary?.category || "Kategória"}: {categories.find(c => c.slug === selectedCategory)?.name}
            </span>
          )}
          {(priceFrom || priceTo) && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {dictionary?.price_from || "Cena"}: {priceFrom || '0'} - {priceTo || '∞'}
            </span>
          )}
          {sortBy && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {dictionary?.sort_by || "Zoradenie"}: {sortBy}
            </span>
          )}
        </div>
      )}
    </div>
  );
} 