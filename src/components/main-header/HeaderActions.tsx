import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { FiUser, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { FaShoppingCart } from 'react-icons/fa';

interface HeaderActionsProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { items } = useCart();

  return (
    <div className="flex items-center space-x-4">
      <Link href="/account" className="hidden sm:block p-2 text-gray-700 hover:text-blue-600">
        <FiUser className="w-5 h-5" />
      </Link>
      <Link href="/wishlist" className="hidden sm:block p-2 text-gray-700 hover:text-blue-600">
        <FiHeart className="w-5 h-5" />
      </Link>
      <Link href="/cart" className="hidden sm:block p-2 text-gray-700 hover:text-blue-600 relative" aria-label="Košík">
        <FaShoppingCart className="w-5 h-5" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </Link>
      
      {/* Mobilní menu toggle - viditelný pouze na mobilních zařízeních */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-gray-700 md:hidden"
        aria-label={isMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
      >
        {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>
    </div>
  );
};

export { HeaderActions }; 