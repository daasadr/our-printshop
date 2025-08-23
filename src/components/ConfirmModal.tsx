'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/context/LocaleContext';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  dictionary?: any;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText,
  cancelText,
  dictionary 
}) => {
  const { locale } = useLocale();
  const [translations, setTranslations] = useState<any>(null);

  // Načítanie statických prekladov z public/locales
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}/common.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.warn('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, [locale]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg p-6 shadow-2xl max-w-md w-full mx-4 border-2 border-red-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-red-600 mb-4">
            ⚠️ {title}
          </h3>
          
          <p className="text-gray-700 mb-6 text-lg">
            {message}
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onClose}
              variant="secondary"
              size="md"
            >
              {cancelText || translations?.cancel || 'Zrušiť'}
            </Button>
            
            <Button
              onClick={handleConfirm}
              variant="danger"
              size="md"
            >
              {confirmText || translations?.confirm || 'Potvrdiť'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

