"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getRegionalPrice } from '@/utils/pricing';

export interface CartItem {
  variantId: string;
  quantity: number;
  name: string;
  price: number; // Základná cena v EUR
  image?: string;
  sourceCurrency: string; // Mena, v ktorej bola cena pôvodne
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

const CART_EXPIRATION_DAYS = 7; // Košík vyprší po 7 dňoch
const CART_STORAGE_KEY = 'shopping-cart';

function isCartExpired(timestamp: number): boolean {
  const now = Date.now();
  const expirationTime = CART_EXPIRATION_DAYS * 24 * 60 * 60 * 1000; // Prevod dní na milisekundy
  return now - timestamp > expirationTime;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { currency, locale } = useLocale();
  const { countryCode, isLoading: geolocationLoading } = useGeolocation();

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
    
    // Uložíme základnú cenu v EUR (bez regionálnych úprav)
    const itemToStore = {
      ...newItem,
      price: newItem.price, // Základná cena v EUR
      sourceCurrency: 'EUR' // Vždy ukládáme v EUR
    };
    
    console.log('Storing item with base price in EUR:', itemToStore);
    
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
    console.log('useCart - Removing item with variantId:', variantId);
    setItems(currentItems => {
      const filtered = currentItems.filter(item => item.variantId !== variantId);
      console.log('useCart - Items after removal:', filtered);
      return filtered;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Aplikovanie regionálnych cien a konverzia podľa geolokácie
  const convertedItems = React.useMemo(() => {
    // Čakáme na načítanie geolokácie, aby sme predišli hydration erroru
    if (geolocationLoading) {
      console.log('useCart - Waiting for geolocation to load...');
      return items; // Vrátime pôvodné ceny bez regionálnych úprav
    }
    
    console.log('useCart - Applying regional pricing for country:', countryCode);
    console.log('useCart - Original items:', items);
    
    const converted = items.map(item => {
      const basePrice = item.price; // Základná cena v EUR
      const regionalPrice = getRegionalPrice(basePrice, countryCode);
      
      console.log(`useCart - ${item.name}: ${basePrice} EUR → ${regionalPrice.price} ${regionalPrice.zone.currency} (multiplier: ${regionalPrice.zone.multiplier})`);
      
      return {
        ...item,
        price: regionalPrice.price, // Regionálna cena
        regionalPrice: regionalPrice // Pre prípadné použitie
      };
    });
    
    console.log('useCart - Items with regional pricing:', converted);
    return converted;
  }, [items, countryCode, geolocationLoading]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = convertedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items: convertedItems, // Používáme regionálne ceny
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