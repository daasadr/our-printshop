"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

interface CartProps {
  className?: string;
}

const Cart: React.FC<CartProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Ikona košíku */}
      <button
        onClick={toggleCart}
        className="relative p-2 text-gray-700 transition-colors hover:text-blue-600"
        aria-label="Košík"
      >
        <FaShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
          />

          {/* Panel košíku */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Košík</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 py-6">Váš košík je prázdný</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex space-x-4">
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
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Odstranění položky */}
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTrash />
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
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Pokračovat k pokladně
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;