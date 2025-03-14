"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  variantId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
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

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Načtení košíku z localStorage při prvním renderování
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (e) {
        console.error('Chyba při načítání košíku:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Uložení košíku do localStorage při každé změně
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      // Zkontrolujeme, zda položka již v košíku existuje
      const existingItemIndex = currentItems.findIndex(
        item => item.variantId === newItem.variantId
      );

      if (existingItemIndex > -1) {
        // Pokud položka existuje, aktualizujeme množství
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Pokud položka neexistuje, přidáme ji do košíku
        return [...currentItems, newItem];
      }
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (variantId: string) => {
    setItems(currentItems =>
      currentItems.filter(item => item.variantId !== variantId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Výpočet celkového počtu položek v košíku
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Výpočet celkové ceny
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};