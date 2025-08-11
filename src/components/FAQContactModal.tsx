"use client";

import React, { useState } from 'react';
import ContactForm from './ContactForm';

interface FAQContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: any;
}

const FAQContactModal: React.FC<FAQContactModalProps> = ({ isOpen, onClose, dictionary }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transition-all duration-200 ${
            isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {dictionary?.contact?.title || 'Kontaktujte nás'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Zavřít"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              {dictionary?.contact?.subtitle || 'Máte dotaz? Neváhejte nás kontaktovat. Odpovíme vám co nejdříve.'}
            </p>
            <ContactForm dictionary={dictionary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQContactModal;
