'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { FiX, FiHeart, FiShoppingCart, FiArrowRight, FiTrash2, FiSave } from 'react-icons/fi';
import { getDictionary } from '@/lib/getDictionary';
import CartRecommendations from './CartRecommendations';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SavedItem {
  id: string;
  variantId: string;
  name: string;
  price: number;
  image: string;
  savedAt: Date;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { locale, currency } = useLocale();
  const [dictionary, setDictionary] = useState<any>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [activeTab, setActiveTab] = useState<'cart' | 'saved'>('cart');

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

  // Load saved items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedForLater');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedItems(parsed.map((item: any) => ({
          ...item,
          savedAt: new Date(item.savedAt)
        })));
      } catch (error) {
        console.warn('Failed to parse saved items:', error);
      }
    }
  }, []);

  // Save items to localStorage
  const saveToLocalStorage = (items: SavedItem[]) => {
    localStorage.setItem('savedForLater', JSON.stringify(items));
  };

  // Ceny jsou už konvertované z useCart hooku
  const convertedItems = items;

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

  const handleSaveForLater = (item: any) => {
    // Kontrola, zda je uživatel přihlášený
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Pro uložení položky do oblíbených se musíte přihlásit nebo zaregistrovat.');
      return;
    }

    const savedItem: SavedItem = {
      id: `${item.variantId}-${Date.now()}`,
      variantId: item.variantId,
      name: item.name,
      price: item.price,
      image: item.image,
      savedAt: new Date()
    };

    const newSavedItems = [...savedItems, savedItem];
    setSavedItems(newSavedItems);
    saveToLocalStorage(newSavedItems);
    removeFromCart(item.variantId);
  };

  const handleMoveToCart = (savedItem: SavedItem) => {
    // Add back to cart
    // Note: This would need to be implemented in useCart hook
    console.log('Move to cart:', savedItem);
    
    // Remove from saved items
    const newSavedItems = savedItems.filter(item => item.id !== savedItem.id);
    setSavedItems(newSavedItems);
    saveToLocalStorage(newSavedItems);
  };

  const handleRemoveSaved = (savedItem: SavedItem) => {
    if (confirm(`${dictionary?.cart?.confirm_remove || 'Opravdu chcete odebrat'} ${savedItem.name}?`)) {
      const newSavedItems = savedItems.filter(item => item.id !== savedItem.id);
      setSavedItems(newSavedItems);
      saveToLocalStorage(newSavedItems);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {dictionary?.cart?.title || 'Košík'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Zavrieť"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'cart'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {dictionary?.cart?.title || 'Košík'} ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {dictionary?.cart?.saved_for_later || 'Uložené'} ({savedItems.length})
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'cart' ? (
              // Cart items
              <div className="p-6">
                {convertedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <FiShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      {dictionary?.cart?.empty || 'Váš košík je prázdný'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {convertedItems.map((item) => (
                      <div key={item.variantId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
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
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price, currency)} × {item.quantity}
                          </p>
                          
                          {/* Quantity controls */}
                          <div className="flex items-center mt-2 space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.variantId, item.quantity - 1, item.name)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.variantId, item.quantity + 1, item.name)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Uložiť na neskôr"
                          >
                            <FiSave className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuantityChange(item.variantId, 0, item.name)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Odobrať"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Saved items
              <div className="p-6">
                {savedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <FiHeart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">{dictionary?.cart?.no_saved_items || 'Nemáte uložené položky'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
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
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatPrice(convertCurrency(item.price, currency), currency)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {dictionary?.cart?.saved_on || 'Uložené'} {item.savedAt.toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title={dictionary?.cart?.move_to_cart || 'Presunúť do košíka'}
                          >
                            <FiShoppingCart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveSaved(item)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title={dictionary?.cart?.remove || 'Odobrať'}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab === 'cart' && convertedItems.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">
                  {dictionary?.cart?.total || 'Celkem:'}
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(convertedTotalPrice, currency)}
                </span>
              </div>
              
              <div className="space-y-3">
                <Link
                  href={`/${locale}/cart`}
                  className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                  onClick={onClose}
                >
                  {dictionary?.cart?.view_cart || 'Zobraziť košík'}
                  <FiArrowRight className="inline ml-2 w-4 h-4" />
                </Link>
                
                <button
                  onClick={() => {
                    if (confirm(dictionary?.cart?.confirm_clear || 'Opravdu chcete vyprázdniť košík?')) {
                      clearCart();
                      onClose();
                    }
                  }}
                  className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center text-sm"
                >
                  {dictionary?.cart?.clear || 'Vyprázdniť košík'}
                </button>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {activeTab === 'cart' && (
            <div className="border-t border-gray-200 p-6">
              <CartRecommendations />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
