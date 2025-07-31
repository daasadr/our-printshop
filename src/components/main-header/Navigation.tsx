"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
// import { signOut, useSession } from 'next-auth/react'; // ODSTRANĚNO
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
  // const session = useSession(); // ODSTRANĚNO
  const { locale } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  
  // JWT Auth state
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Funkce pro zjištění, zda je odkaz aktivní
  const isActive = (path: string) => {
    return pathname === `/${locale}${path}`;
  };

  // Funkce pro vytvoření jazykového odkazu
  const getLocalizedLink = (path: string) => {
    return `/${locale}${path}`;
  };

  // JWT Auth functions
  const checkAuthStatus = async () => {
    try {
      console.log('Navigation: Checking auth status...');
      const accessToken = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      console.log('Navigation: Access token found:', !!accessToken);
      console.log('Navigation: User data found:', !!userData);
      
      if (!accessToken || !userData) {
        console.log('Navigation: No access token or user data, setting user to null');
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Parsujeme user data z localStorage
      try {
        const user = JSON.parse(userData);
        console.log('Navigation: Setting user from localStorage:', user.email);
        setUser(user);
      } catch (parseError) {
        console.error('Navigation: Error parsing user data:', parseError);
        setUser(null);
      }
    } catch (error) {
      console.error('Navigation: Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Voláme náš logout endpoint
      const response = await fetch('/api/auth/logout-directus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        console.log('Logout successful');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Vždy vyčistíme localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      setUser(null);
      
      // Vyvoláme custom event pro ostatní komponenty
      window.dispatchEvent(new Event('auth-status-changed'));
      
      // Přesměrujeme na hlavní stránku
      router.push(`/${locale}`);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for storage changes (when user logs in/out)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user_data') {
        console.log('Navigation: Storage changed, checking auth status...');
        checkAuthStatus();
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same tab)
    const handleCustomStorageChange = () => {
      console.log('Navigation: Custom storage event received, checking auth status...');
      checkAuthStatus();
    };

    window.addEventListener('auth-status-changed', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-status-changed', handleCustomStorageChange);
    };
  }, []);

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
        {!isLoading && user ? (
          <>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {dictionary?.navigation?.logout || "Odhlásit"}
            </button>
          </>
        ) : !isLoading && !user ? (
          <>
            <Link 
              href={getLocalizedLink('/prihlaseni')} 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {dictionary?.navigation?.login || "Přihlásit"}
            </Link>
            <Link 
              href={getLocalizedLink('/registrace')} 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {dictionary?.navigation?.register || "Registrovat"}
            </Link>
          </>
        ) : null}
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
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
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
            {!isLoading && user && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Link
                  href={getLocalizedLink('/ucet')}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 mr-3" /> {dictionary?.navigation?.my_account || "Můj účet"}
                </Link>
                <Link
                  href={getLocalizedLink('/wishlist')}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHeart className="w-5 h-5 mr-3" /> {dictionary?.navigation?.favorites || "Oblíbené"}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <FiUser className="w-5 h-5 mr-3" /> {dictionary?.navigation?.logout || "Odhlásit"}
                </button>
              </div>
            )}
            {!isLoading && !user && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Link
                  href={getLocalizedLink('/prihlaseni')}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 mr-3" /> {dictionary?.navigation?.login || "Přihlásit"}
                </Link>
                <Link
                  href={getLocalizedLink('/registrace')}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 mr-3" /> {dictionary?.navigation?.register || "Registrovat"}
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