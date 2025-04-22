"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { FiMenu, FiX, FiUser, FiHeart } from 'react-icons/fi';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();

  // Sledování scrollu pro změnu stylu headeru
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Funkce pro zjištění, zda je odkaz aktivní
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="h-10 w-32 relative">
              {/* Zde by bylo vaše logo */}
              <div className="font-bold text-xl">HappyWilderness</div>
            </div>
          </Link>

          {/* Desktopová navigace */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Domů
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium ${
                isActive('/products') || pathname.startsWith('/products/')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Produkty
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium ${
                isActive('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              O nás
            </Link>
            <Link
              href="/kontakt"
              className={`text-sm font-medium ${
                isActive('/kontakt') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Kontakt
            </Link>
          </nav>

          {/* Akce uživatele */}
          <div className="flex items-center space-x-4">
            <Link href="/account" className="hidden sm:block p-2 text-gray-700 hover:text-blue-600">
              <FiUser className="w-5 h-5" />
            </Link>
            <Link href="/wishlist" className="hidden sm:block p-2 text-gray-700 hover:text-blue-600">
              <FiHeart className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 hover:text-blue-600"
            >
              Košík ({items.length})
            </Link>

            {/* Mobilní menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 md:hidden"
              aria-label={isMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobilní menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-base ${
                  isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Domů
              </Link>
              <Link
                href="/products"
                className={`text-base ${
                  isActive('/products') || pathname.startsWith('/products/')
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Produkty
              </Link>
              <Link
                href="/about"
                className={`text-base ${
                  isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                O nás
              </Link>
              <Link
                href="/kontakt"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/kontakt') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
              <div className="pt-2 flex space-x-4 sm:hidden">
                <Link
                  href="/account"
                  className="flex items-center text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 mr-2" /> Můj účet
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHeart className="w-5 h-5 mr-2" /> Oblíbené
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export { Header};