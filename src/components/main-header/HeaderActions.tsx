import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { FiUser, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { FaShoppingCart } from 'react-icons/fa';
import LocaleSwitch from '@/components/LocaleSwitch';

interface HeaderActionsProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { items } = useCart();

  return (
    <div className="flex items-center space-x-2">
      {/* Přepínač jazyka - viditelný na všech zařízeních */}
      <div className="hidden sm:block">
        <LocaleSwitch />
      </div>
      
      {/* Desktop ikony */}
      <div className="hidden sm:flex items-center space-x-1">
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
      
      {/* Mobilní přepínač jazyka */}
      <div className="sm:hidden">
        <LocaleSwitch />
      </div>
      
      {/* Mobilní menu toggle - viditelný pouze na mobilních zařízeních */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-gray-700 lg:hidden transition-colors rounded-md hover:bg-gray-100"
        aria-label={isMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
      >
        {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>
    </div>
  );
};

export { HeaderActions }; 