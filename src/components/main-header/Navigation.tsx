"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiMenu, FiX, FiUser, FiHeart, FiSearch } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';
import LocaleSwitch from '@/components/LocaleSwitch';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  dictionary?: any;
}

const Navigation: React.FC<NavigationProps> = ({ isMenuOpen, setIsMenuOpen, dictionary }) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const session = useSession();
  const { locale } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Funkce pro zjištění, zda je odkaz aktivní
  const isActive = (path: string) => {
    return pathname === `/${locale}${path}`;
  };

  // Funkce pro vytvoření jazykového odkazu
  const getLocalizedLink = (path: string) => {
    return `/${locale}${path}`;
  };

  // Click outside handler pro search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Search zůstane otevřený na mobilu
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktopová navigace - vždy viditelná */}
      <nav className="hidden xl:flex items-center space-x-6">
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
        <div className="xl:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
          {/* Jazykové buttony - pouze na mobilu */}
          <div className="mb-4 flex justify-center">
            <LocaleSwitch />
          </div>
          
          {/* Mobilní search bar */}
          <div className="mb-4" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={dictionary?.search_placeholder || "Hľadať produkty..."}
                  className="w-full pl-10 pr-4 py-3 text-sm border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
              >
                {dictionary?.search_button || "Hľadať"}
              </button>
            </form>
          </div>

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