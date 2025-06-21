"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type TFunction = (key: string) => string;

interface Category {
  id: string;
  name: string;
}

interface ProductFilterSidebarProps {
  onFilterApplied?: () => void;
  t: TFunction;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({ onFilterApplied, t }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');
  const [name, setName] = useState(searchParams.get('name') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [color, setColor] = useState(searchParams.get('color') || '');
  const [size, setSize] = useState(searchParams.get('size') || '');

  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async (url: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      try {
        const response = await fetch(url);
        if (response.ok) setter(await response.json());
      } catch (error) {
        console.error(`Failed to fetch from ${url}`, error);
      }
    };
    fetchData('/api/categories', setCategories);
    fetchData('/api/variants/colors', setColors);
    fetchData('/api/variants/sizes', setSizes);
  }, []);

  const handleFilterChange = () => {
    const params = new URLSearchParams();
    if (priceMin) params.set('price_min', priceMin);
    if (priceMax) params.set('price_max', priceMax);
    if (name) params.set('name', name);
    if (categoryId) params.set('category', categoryId);
    if (color) params.set('color', color);
    if (size) params.set('size', size);
    router.push(`/products?${params.toString()}`);
    onFilterApplied?.();
  };

  const handleReset = () => {
    setPriceMin('');
    setPriceMax('');
    setName('');
    setCategoryId('');
    setColor('');
    setSize('');
    router.push('/products');
    onFilterApplied?.();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-600">{t('category')}</label>
          <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">{t('all_categories')}</option>
            {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-600">{t('color')}</label>
          <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={color} onChange={e => setColor(e.target.value)}>
            <option value="">{t('all_colors')}</option>
            {colors.map(c => ( <option key={c} value={c}>{c}</option> ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-600">{t('size')}</label>
          <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={size} onChange={e => setSize(e.target.value)}>
            <option value="">{t('all_sizes')}</option>
            {sizes.map(s => ( <option key={s} value={s}>{s}</option> ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-600">{t('price_from')}</label>
          <input type="number" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={priceMin} onChange={e => setPriceMin(e.target.value)} min="0" step="0.01" placeholder={t('min_placeholder')} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-600">{t('price_to')}</label>
          <input type="number" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={priceMax} onChange={e => setPriceMax(e.target.value)} min="0" step="0.01" placeholder={t('max_placeholder')} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-600">{t('product_name')}</label>
          <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={name} onChange={e => setName(e.target.value)} placeholder={t('search_placeholder')} />
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-auto">
        <button onClick={handleFilterChange} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
          {t('show_results')}
        </button>
        <button onClick={handleReset} className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition duration-300">
          {t('reset_filters')}
        </button>
      </div>
    </div>
  );
}; 