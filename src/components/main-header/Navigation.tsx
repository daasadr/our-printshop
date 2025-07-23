"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiMenu, FiX, FiUser, FiHeart } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  dictionary?: any;
}

const Navigation: React.FC<NavigationProps> = ({ isMenuOpen, setIsMenuOpen, dictionary }) => {
  const pathname = usePathname();
  const params = useParams();
  const session = useSession();
  const { locale } = useLocale();

  // Funkce pro zjištění, zda je odkaz aktivní
  const isActive = (path: string) => {
    return pathname === `/${locale}${path}`;
  };

  // Funkce pro vytvoření jazykového odkazu
  const getLocalizedLink = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <>
      {/* Desktopová navigace - vždy viditelná */}
      <nav className="hidden lg:flex items-center space-x-6">
        <Link 
          href={getLocalizedLink('/products')} 
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            isActive('/products') || pathname.startsWith(`/${locale}/products/`)
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          {dictionary?.navigation?.products || "Produkty"}
        </Link>
        <Link 
          href={getLocalizedLink('/about')} 
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            isActive('/about') 
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          {dictionary?.navigation?.about || "O nás"}
        </Link>
        <Link 
          href={getLocalizedLink('/kontakt')} 
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            isActive('/kontakt') 
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          {dictionary?.navigation?.contact || "Kontakt"}
        </Link>
        {session?.data ? (
          <>
            <span className="px-3 py-2 text-sm text-gray-700">
              {dictionary?.navigation?.welcome_user?.replace('{{name}}', session.data.user?.name || session.data.user?.email) || `Vítejte, ${session.data.user?.name || session.data.user?.email}`}
            </span>
            <button
              onClick={() => signOut()}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {dictionary?.navigation?.logout || "Odhlásit"}
            </button>
          </>
        ) : (
          <>
            <Link 
              href="/auth/signin" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {dictionary?.navigation?.login || "Přihlásit"}
            </Link>
            <Link 
              href="/auth/signup" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {dictionary?.navigation?.register || "Registrovat"}
            </Link>
          </>
        )}
      </nav>

      {/* Mobilní menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
          <nav className="flex flex-col space-y-3">
            <Link
              href={getLocalizedLink('/')}
              className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary?.navigation?.home || "Domů"}
            </Link>
            <Link
              href={getLocalizedLink('/products')}
              className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive('/products') || pathname.startsWith(`/${locale}/products/`)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary?.navigation?.products || "Produkty"}
            </Link>
            <Link
              href={getLocalizedLink('/about')}
              className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary?.navigation?.about || "O nás"}
            </Link>
            <Link
              href={getLocalizedLink('/kontakt')}
              className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive('/kontakt') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary?.navigation?.contact || "Kontakt"}
            </Link>
            {session?.data && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Link
                  href="/account"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 mr-3" /> {dictionary?.navigation?.my_account || "Můj účet"}
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHeart className="w-5 h-5 mr-3" /> {dictionary?.navigation?.favorites || "Oblíbené"}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation; 