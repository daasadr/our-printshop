"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useAccessibility } from '@/hooks/useAccessibility';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

interface CartProps {
  className?: string;
}

const Cart: React.FC<CartProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { announce, trapFocus, LiveRegionElement } = useAccessibility();
  const cartPanelRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  const toggleCart = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      announce(`Košík otevřen. ${totalItems} položek v košíku.`);
    } else {
      announce("Košík zavřen.");
      // Return focus to cart button when closing
      setTimeout(() => cartButtonRef.current?.focus(), 100);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (isOpen && cartPanelRef.current) {
      const cleanup = trapFocus(cartPanelRef.current);
      
      // Focus the first focusable element in the cart
      const firstFocusable = cartPanelRef.current.querySelector('button, a') as HTMLElement;
      firstFocusable?.focus();
      
      return cleanup;
    }
  }, [isOpen, trapFocus]);

  // Handle escape key to close cart
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        cartButtonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleQuantityChange = (variantId: string, newQuantity: number, itemName: string) => {
    updateQuantity(variantId, newQuantity);
    announce(`${itemName} množství změněno na ${newQuantity}`);
  };

  const handleRemoveItem = (variantId: string, itemName: string) => {
    removeFromCart(variantId);
    announce(`${itemName} odstraněn z košíku`, 'assertive');
  };

  return (
    <div className={`relative ${className}`}>
      <LiveRegionElement />
      
      {/* Ikona košíku */}
      <button
        ref={cartButtonRef}
        onClick={toggleCart}
        className="relative p-2 text-gray-700 transition-colors hover:text-blue-600"
        aria-label={`Košík, ${totalItems} položek`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <FaShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            aria-hidden="true"
          >
            {totalItems}
          </span>
        )}
      </button>

      {/* Vysouvací panel košíku */}
      {isOpen && (
        <>
          {/* Overlay pro zavření košíku kliknutím mimo */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel košíku */}
          <div 
            ref={cartPanelRef}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            aria-describedby="cart-description"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 id="cart-title" className="text-lg font-semibold">Košík</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Zavřít košík"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
              <p id="cart-description" className="sr-only">
                Dialog s obsahem nákupního košíku. Stiskněte Escape pro zavření.
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto" role="region" aria-label="Položky v košíku">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 py-6">Váš košík je prázdný</p>
              ) : (
                <ul className="divide-y divide-gray-200" role="list">
                  {items.map((item) => (
                    <li key={item.variantId} className="p-4 flex items-center space-x-4" role="listitem">
                      {/* Obrázek produktu */}
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>

                      {/* Detaily produktu */}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.price.toFixed(2)} Kč × {item.quantity}
                        </p>

                        {/* Úprava množství */}
                        <div className="flex items-center mt-1" role="group" aria-label={`Množství pro ${item.name}`}>
                          <button
                            onClick={() => handleQuantityChange(item.variantId, item.quantity - 1, item.name)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            aria-label={`Snížit množství ${item.name}`}
                            disabled={item.quantity <= 1}
                          >
                            <span aria-hidden="true">-</span>
                          </button>
                          <span className="mx-2 text-sm" aria-label={`Množství: ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.variantId, item.quantity + 1, item.name)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            aria-label={`Zvýšit množství ${item.name}`}
                          >
                            <span aria-hidden="true">+</span>
                          </button>
                        </div>
                      </div>

                      {/* Odstranění položky */}
                      <button
                        onClick={() => handleRemoveItem(item.variantId, item.name)}
                        className="text-gray-400 hover:text-red-500 p-2"
                        aria-label={`Odebrat ${item.name} z košíku`}
                      >
                        <FaTrash aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between font-semibold mb-4">
                  <span>Celkem:</span>
                  <span>{totalPrice.toFixed(2)} Kč</span>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-2 text-center bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Zobrazit košík
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Pokračovat k pokladně
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;