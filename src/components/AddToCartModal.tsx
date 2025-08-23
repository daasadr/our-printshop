'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: any;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose, dictionary }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {dictionary?.product?.added_to_cart || 'Produkt byl přidán do košíku!'}
          </h3>
          
          <Button
            onClick={onClose}
            variant="primary"
            className="w-full"
          >
            {dictionary?.product?.close || 'Zavřít'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;

