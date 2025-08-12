"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/context/LocaleContext';
import { getDictionary } from '@/lib/getDictionary';
import MiniCart from './MiniCart';

interface CartProps {
  className?: string;
}

const Cart: React.FC<CartProps> = ({ className = '' }) => {
  const { items = [] } = useCart();
  const { locale } = useLocale();
  const [dictionary, setDictionary] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100 relative"
        aria-label="Košík"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {items.length}
          </span>
        )}
      </button>
      
      <MiniCart
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Cart;