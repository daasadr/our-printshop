'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cart: any | null;
  loading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // Změněno na false
  const [error, setError] = useState<string | null>(null);

  // NENÍ automatické načtení košíku při startu
  // Košík se načte pouze když je potřeba

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart');
      if (!response.ok) {
        if (response.status === 401) {
          // Uživatel není přihlášen - to je v pořádku
          setCart(null);
          return;
        }
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (variantId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item from cart');
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update cart item');
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to clear cart');
      setCart(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart, // Exportujeme fetchCart pro manuální volání
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 