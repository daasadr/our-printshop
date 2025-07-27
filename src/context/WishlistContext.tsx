'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  image?: string;
  addedAt: number;
}

interface StoredWishlist {
  items: WishlistItem[];
  timestamp: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_EXPIRATION_DAYS = 30; // Wishlist vyprší po 30 dňoch
const WISHLIST_STORAGE_KEY = 'wishlist';

function isWishlistExpired(timestamp: number): boolean {
  const now = Date.now();
  const expirationTime = WISHLIST_EXPIRATION_DAYS * 24 * 60 * 60 * 1000; // Prevod dní na milisekundy
  return now - timestamp > expirationTime;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Načítanie wishlistu z localStorage pri prvom načítaní
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (savedWishlist) {
          const parsedWishlist: StoredWishlist = JSON.parse(savedWishlist);
          
          // Kontrola expirácie
          if (isWishlistExpired(parsedWishlist.timestamp)) {
            localStorage.removeItem(WISHLIST_STORAGE_KEY);
            return;
          }

          setItems(parsedWishlist.items);
        }
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }
    };

    loadWishlist();

    // Čistenie expirovaných wishlistov pri načítaní a každých 24 hodín
    const cleanupInterval = setInterval(loadWishlist, 24 * 60 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Uloženie wishlistu do localStorage pri každej zmene
  useEffect(() => {
    try {
      const wishlistData: StoredWishlist = {
        items,
        timestamp: Date.now()
      };
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistData));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
      // Ak je localStorage plné, vymažeme wishlist
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }
    }
  }, [items]);

  const addToWishlist = (newItem: Omit<WishlistItem, 'addedAt'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.productId === newItem.productId);
      
      if (existingItem) {
        // Produkt už je v wishliste, nepridávame ho znova
        return currentItems;
      }
      
      // Pridáme nový produkt s aktuálnym časom
      const itemWithTimestamp: WishlistItem = {
        ...newItem,
        addedAt: Date.now()
      };
      
      return [...currentItems, itemWithTimestamp];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.productId !== productId)
    );
  };

  const clearWishlist = () => {
    setItems([]);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId);
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
} 