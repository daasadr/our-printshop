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
  dictionary?: any;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isMobile = false,
  dictionary
}) => {
  const { items } = useCart();
  const router = useRouter();
  const params = useParams();
  const { locale } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus na input po otevření
      setTimeout(() => {
        const input = searchRef.current?.querySelector('input');
        if (input) input.focus();
      }, 100);
    }
  };

  // Desktop layout - ikony + lupička
  if (!isMobile) {
    return (
      <div className="flex items-center space-x-3 relative">
        {/* Přepínač jazyka */}
        <LocaleSwitch />
        
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
          {/* Lupička pro vyhledávání */}
          <button
            onClick={toggleSearch}
            className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100"
            aria-label="Vyhledávání"
          >
            <FiSearch className="w-5 h-5" />
          </button>
        </div>
        
        {/* Vyhledávací lišta - zobrazí se jako velký search bar */}
        {isSearchOpen && (
          <div 
            ref={searchRef}
            className="absolute top-full right-0 mt-2 bg-white border-2 border-blue-500 shadow-lg rounded-lg z-50 p-4 min-w-96"
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={dictionary?.search_placeholder || "Hledat produkty..."}
                  className="w-full pl-10 pr-4 py-3 text-sm border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
              >
                {dictionary?.search_button || "Hledat"}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Mobile/Tablet layout - ikony + menu toggle
  return (
    <div className="flex items-center space-x-2 relative">
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
        {/* Lupička pro vyhledávání na mobilu */}
        <button
          onClick={toggleSearch}
          className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100"
          aria-label="Vyhledávání"
        >
          <FiSearch className="w-5 h-5" />
        </button>
      </div>
      
      {/* Menu toggle */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
        aria-label={isMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
      >
        {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>
      
      {/* Vyhledávací lišta pro mobil - zobrazí se jako velký search bar */}
      {isSearchOpen && (
        <div 
          ref={searchRef}
          className="absolute top-full right-0 mt-2 bg-white border-2 border-blue-500 shadow-lg rounded-lg z-50 p-4 min-w-80"
        >
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                                  placeholder={dictionary?.search_placeholder || "Hledat produkty..."}
                className="w-full pl-10 pr-4 py-3 text-sm border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
            >
              {dictionary?.search_button || "Hledat"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HeaderActions; 