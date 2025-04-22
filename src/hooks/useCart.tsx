"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  variantId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
}

interface StoredCart {
  items: CartItem[];
  timestamp: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_EXPIRATION_DAYS = 7; // Košík vyprší po 7 dnech
const CART_STORAGE_KEY = 'shopping-cart';

function isCartExpired(timestamp: number): boolean {
  const now = Date.now();
  const expirationTime = CART_EXPIRATION_DAYS * 24 * 60 * 60 * 1000; // Převod dnů na milisekundy
  return now - timestamp > expirationTime;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Načtení košíku z localStorage při prvním načtení
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart: StoredCart = JSON.parse(savedCart);
          
          // Kontrola expirace
          if (isCartExpired(parsedCart.timestamp)) {
            localStorage.removeItem(CART_STORAGE_KEY);
            return;
          }

          setItems(parsedCart.items);
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    };

    loadCart();

    // Čištění expirovaných košíků při načtení a každých 24 hodin
    const cleanupInterval = setInterval(loadCart, 24 * 60 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Uložení košíku do localStorage při každé změně
  useEffect(() => {
    try {
      const cartData: StoredCart = {
        items,
        timestamp: Date.now()
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      // Pokud je localStorage plné, smažeme košík
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.variantId === newItem.variantId);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.variantId === newItem.variantId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      return [...currentItems, newItem];
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setItems(currentItems => {
      if (quantity <= 0) {
        return currentItems.filter(item => item.variantId !== variantId);
      }
      
      return currentItems.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (variantId: string) => {
    setItems(currentItems => currentItems.filter(item => item.variantId !== variantId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};