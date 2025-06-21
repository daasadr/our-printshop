"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { FiMenu, FiX, FiUser, FiHeart, FiShoppingCart, FiSearch } from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'next-i18next';
import { FilterModal } from '../FilterModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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
    <>
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
                  <Link href={`/${lang}/auth/signin`} className="p-2 text-gray-700 hover:text-blue-600">{t('header.login')}</Link>
                  <Link href={`/${lang}/auth/signup`} className="p-2 text-gray-700 hover:text-blue-600">{t('header.register')}</Link>
                </>
              )}
            </nav>

            {/* Akce uživatele + jazykový prepínač */}
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsFilterModalOpen(true)} className="p-2 text-gray-700 hover:text-blue-600" aria-label="Vyhľadať produkty">
                <FiSearch className="w-5 h-5" />
              </button>
              <Link href={`/${lang}/wishlist`} className="p-2 text-gray-700 hover:text-blue-600" aria-label="Obľúbené">
                <FiHeart className="w-5 h-5" />
              </Link>
              <Link href={`/${lang}/cart`} className="relative p-2 text-gray-700 hover:text-blue-600" aria-label="Nákupný košík">
                <FiShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Mobilní menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 md:hidden"
                aria-label={isMenuOpen ? t('header.menu.close') : t('header.menu.open')}
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
                  href={`/${lang}`}
                  className={`text-base ${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.menu.home')}
                </Link>
                <Link
                  href={`/${lang}/products`}
                  className={`text-base ${isActive('/products') || pathname.startsWith(`/${lang}/products/`) ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.menu.products')}
                </Link>
                <Link
                  href={`/${lang}/about`}
                  className={`text-base ${isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.menu.about')}
                </Link>
                <Link
                  href={`/${lang}/contact`}
                  className={`text-base ${isActive('/contact') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.menu.contact')}
                </Link>
                 <div className="sm:hidden pt-4">
                  <LanguageSwitcher />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </>
  );
};

export { Header };