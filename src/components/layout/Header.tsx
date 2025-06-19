"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { FiMenu, FiX, FiUser, FiHeart } from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'next-i18next';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();
  const session = useSession();
  const params = useParams();
  const lang = (params?.lang as string) || "cs";
  const { t } = useTranslation('common');

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
    return pathname === `/${lang}${path}`;
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
          <Link href={`/${lang}`} className="text-2xl font-bold">
            HappyWilderness
          </Link>

          {/* Desktopová navigace */}
          <nav className="hidden md:flex items-center space-x-4">
            {session?.data ? (
              <>
                <span className="text-gray-700">
                  {t('header.welcome_user', { name: session.data.user?.name || session.data.user?.email || '' })}
                </span>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-700 hover:text-blue-600"
                >
                  {t('header.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${lang}/auth/signin`} className="p-2 text-gray-700 hover:text-blue-600">
                  {t('header.login')}
                </Link>
                <Link href={`/${lang}/auth/signup`} className="p-2 text-gray-700 hover:text-blue-600">
                  {t('header.register')}
                </Link>
              </>
            )}
            <Link href={`/${lang}/cart`} className="p-2 text-gray-700 hover:text-blue-600 relative">
              {t('header.cart')}
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Mobilní menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 md:hidden"
              aria-label={isMenuOpen ? t('header.menu.close') : t('header.menu.open')}
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Akce uživatele + jazykový prepínač */}
          <div className="flex items-center space-x-4">
            <Link href={`/${lang}/account`} className="hidden sm:block p-2 text-gray-700 hover:text-blue-600">
              <FiUser className="w-5 h-5" />
            </Link>
            <Link href={`/${lang}/wishlist`} className="hidden sm:block p-2 text-gray-700 hover:text-blue-600">
              <FiHeart className="w-5 h-5" />
            </Link>
            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Mobilní menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href={`/${lang}`}
                className={`text-base ${
                  isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.menu.home')}
              </Link>
              <Link
                href={`/${lang}/products`}
                className={`text-base ${
                  isActive('/products') || pathname.startsWith(`/${lang}/products/`)
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.menu.products')}
              </Link>
              <Link
                href={`/${lang}/about`}
                className={`text-base ${
                  isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.menu.about')}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className={`text-base ${
                  isActive('/contact') ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.menu.contact')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export { Header};