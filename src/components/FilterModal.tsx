"use client";

import React from 'react';
import { FiX } from 'react-icons/fi';
import { ProductFilterSidebar } from './ProductFilterSidebar';
import { useTranslation } from 'next-i18next';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');

  if (!isOpen) {
    return null;
  }

  // Táto funkcia zabezpečí, že kliknutie dovnútra modálu ho nezatvorí
  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end" 
      onClick={onClose} // Kliknutie na pozadie zatvorí modál
    >
      <div 
        className="bg-white w-full max-w-sm h-full shadow-xl p-6 animate-slide-in-right" 
        onClick={handleInnerClick} // Kliknutie dovnútra modálu ho nezatvorí
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('product_filter_title')}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <ProductFilterSidebar onFilterApplied={onClose} t={t} />
      </div>
    </div>
  );
}; 