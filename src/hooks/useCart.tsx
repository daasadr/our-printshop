"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { convertCurrency } from '@/utils/currency';

export interface CartItem {
  variantId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  sourceCurrency: string; // Přidáno: měna, ve které byla cena původně
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
  const { currency } = useLocale();

  // Načtení košíku z localStorage při prvním načtení
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        console.log('Loading cart from localStorage:', savedCart);
        
        if (savedCart) {
          const parsedCart: StoredCart = JSON.parse(savedCart);
          console.log('Parsed cart:', parsedCart);
          
          // Kontrola expirace
          if (isCartExpired(parsedCart.timestamp)) {
            console.log('Cart expired, removing from localStorage');
            localStorage.removeItem(CART_STORAGE_KEY);
            return;
          }

          console.log('Setting cart items:', parsedCart.items);
          setItems(parsedCart.items);
        } else {
          console.log('No saved cart found in localStorage');
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    };

    loadCart();
  }, []);

  // Uložení košíku do localStorage při každé změně
  useEffect(() => {
    // Neukládáme prázdný košík při prvním načtení
    if (items.length === 0) {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) {
        console.log('Skipping save - empty cart on first load');
        return;
      }
    }

    try {
      const cartData: StoredCart = {
        items,
        timestamp: Date.now()
      };
      console.log('Saving cart to localStorage:', cartData);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      console.log('Cart saved successfully');
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      // Pokud je localStorage plné, smažeme košík
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    console.log('Adding to cart:', newItem);
    
    // Převedeme cenu na EUR pro uložení (základní měna)
    const priceInEur = convertCurrency(newItem.price, 'EUR', newItem.sourceCurrency as any);
    const itemToStore = {
      ...newItem,
      price: priceInEur,
      sourceCurrency: 'EUR' // Vždy ukládáme v EUR
    };
    
    console.log('Storing item in EUR:', itemToStore);
    
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.variantId === newItem.variantId);
      
      if (existingItem) {
        console.log('Item already exists, updating quantity');
        return currentItems.map(item =>
          item.variantId === newItem.variantId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      console.log('Adding new item to cart');
      return [...currentItems, itemToStore];
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

  // Konverze cen při změně měny
  const convertedItems = React.useMemo(() => {
    console.log('useCart - Converting prices for currency:', currency);
    console.log('useCart - Original items:', items);
    
    const converted = items.map(item => {
      const originalPrice = item.price;
      // Všechny ceny jsou uložené v EUR, konvertujeme na aktuální měnu
      const convertedPrice = convertCurrency(item.price, currency, 'EUR');
      console.log(`useCart - Converting ${item.name}: ${originalPrice} EUR → ${convertedPrice} ${currency}`);
      
      return {
        ...item,
        price: convertedPrice
      };
    });
    
    console.log('useCart - Converted items:', converted);
    return converted;
  }, [items, currency]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = convertedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items: convertedItems, // Používáme konvertované ceny
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