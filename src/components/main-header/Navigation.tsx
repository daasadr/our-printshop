"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiMenu, FiX, FiUser, FiHeart } from 'react-icons/fi';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const pathname = usePathname();
  const session = useSession();

  // Funkce pro zjištění, zda je odkaz aktivní
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Desktopová navigace */}
      <nav className="hidden md:flex items-center space-x-4">
        <Link href="/products" className="p-2 text-gray-700 hover:text-blue-600">
          Produkty
        </Link>
        <Link href="/kontakt" className="p-2 text-gray-700 hover:text-blue-600">
          Kontakt
        </Link>
        {session?.data ? (
          <>
            <span className="text-gray-700">
              Vítejte, {session.data.user?.name || session.data.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="p-2 text-gray-700 hover:text-blue-600"
            >
              Odhlásit
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="p-2 text-gray-700 hover:text-blue-600">
              Přihlásit
            </Link>
            <Link href="/register" className="p-2 text-gray-700 hover:text-blue-600">
              Registrovat
            </Link>
          </>
        )}
      </nav>

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
              href="/kontakt"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/kontakt') ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </Link>
            {session?.data && (
              <div className="space-y-2">
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
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation; 