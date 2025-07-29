"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { getDictionary } from '@/lib/getDictionary';

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
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{dictionary?.cart?.title || 'Košík'}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Zavřít"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              <ul className="space-y-3" role="list">
                {convertedItems.map((item) => (
                  <li key={item.variantId} className="p-4 flex items-center space-x-4" role="listitem">
                    {item.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price, currency)} × {item.quantity}
                      </p>

                      {/* Úprava množství */}
                      <div className="flex items-center mt-1" role="group" aria-label={`${dictionary?.cart?.quantity || 'Množství'} pro ${item.name}`}>
                        <button
                          onClick={() => handleQuantityChange(item.variantId, item.quantity - 1, item.name)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          aria-label={`Snížit ${dictionary?.cart?.quantity?.toLowerCase() || 'množství'} ${item.name}`}
                          disabled={item.quantity <= 1}
                        >
                          <span aria-hidden="true">-</span>
                        </button>
                        <span className="mx-2 text-sm" aria-label={`${dictionary?.cart?.quantity || 'Množství'}: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.variantId, item.quantity + 1, item.name)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          aria-label={`Zvýšit ${dictionary?.cart?.quantity?.toLowerCase() || 'množství'} ${item.name}`}
                        >
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>
                    </div>

                    {/* Odstranění položky */}
                    <button
                      onClick={() => handleQuantityChange(item.variantId, 0, item.name)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label={`${dictionary?.cart?.remove || 'Odebrat'} ${item.name} z košíku`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">{dictionary?.cart?.total || 'Celkem:'}</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(convertedTotalPrice, currency)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Link
                  href={`/${locale}/cart`}
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {dictionary?.cart?.view_cart || 'Zobrazit košík'}
                </Link>
                
                <button
                  onClick={() => {
                    if (confirm(dictionary?.cart?.confirm_clear || 'Opravdu chcete vyprázdnit košík?')) {
                      clearCart();
                      setIsOpen(false);
                    }
                  }}
                  className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-center text-sm font-medium"
                >
                  {dictionary?.cart?.clear || 'Vyprázdnit košík'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;