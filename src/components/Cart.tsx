"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { getDictionary } from '@/lib/getDictionary';
import MiniCart from './MiniCart';

interface CartProps {
  className?: string;
}

const Cart: React.FC<CartProps> = ({ className = '' }) => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { locale, currency } = useLocale();
  const [dictionary, setDictionary] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Načtení dictionary pro aktuální jazyk
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

  // Přepočítáme ceny v košíku podle aktuální měny
  const convertedItems = React.useMemo(() => {
    return items.map(item => ({
      ...item,
      price: convertCurrency(item.price, currency)
    }));
  }, [items, currency]);

  const convertedTotalPrice = React.useMemo(() => {
    return convertedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [convertedItems]);

  const handleQuantityChange = (variantId: string, newQuantity: number, itemName: string) => {
    if (newQuantity <= 0) {
      if (confirm(`${dictionary?.cart?.confirm_remove || 'Opravdu chcete odebrat'} ${itemName}?`)) {
        removeFromCart(variantId);
      }
    } else {
      updateQuantity(variantId, newQuantity);
    }
  };

  if (items.length === 0) {
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
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p className="text-sm">{dictionary?.cart?.empty || 'Váš košík je prázdný'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100 relative"
          aria-label="Košík"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {items.length}
          </span>
        </button>
      </div>

      {/* Enhanced Mini Cart */}
      <MiniCart isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Cart;