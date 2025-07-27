"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FiUser, FiHeart, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/context/LocaleContext';
import LocaleSwitch from '@/components/LocaleSwitch';

interface HeaderActionsProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isMobile?: boolean;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isMobile = false 
}) => {
  const { items } = useCart();
  const router = useRouter();
  const params = useParams();
  const { locale } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dictionary, setDictionary] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Načtení dictionary pro aktuální jazyk
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await import(`../../../public/locales/${locale}/common.json`);
        setDictionary(dict.default);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };

    loadDictionary();
  }, [locale]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  // Desktop layout - plný search bar a všechny ikony
  if (!isMobile) {
    return (
      <div className="flex items-center space-x-3">
        {/* Přepínač jazyka */}
        <LocaleSwitch />
        
        {/* Search bar */}
        <div className="relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={dictionary?.search_placeholder || "Hľadať produkty..."}
                className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                onFocus={() => setIsSearchOpen(true)}
              />
            </div>
            <button
              type="submit"
              className="ml-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              {dictionary?.search_button || "Hľadať"}
            </button>
          </form>
        </div>
        
        {/* Ikony */}
        <div className="flex items-center space-x-1">
          <Link href="/account" className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">
            <FiUser className="w-5 h-5" />
          </Link>
          <Link href="/wishlist" className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">
            <FiHeart className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100 relative" aria-label="Košík">
            <FaShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    );
  }

  // Mobile/Tablet layout - košík, ikony a menu toggle
  return (
    <div className="flex items-center space-x-2">
      {/* Ikony */}
      <div className="flex items-center space-x-1">
        <Link href="/account" className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">
          <FiUser className="w-5 h-5" />
        </Link>
        <Link href="/wishlist" className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">
          <FiHeart className="w-5 h-5" />
        </Link>
        <Link href="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100 relative" aria-label="Košík">
          <FaShoppingCart className="w-5 h-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {items.length}
            </span>
          )}
        </Link>
      </div>
      
      {/* Menu toggle */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
        aria-label={isMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
      >
        {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>
    </div>
  );
};

export { HeaderActions }; 