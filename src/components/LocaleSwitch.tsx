'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';

// SVG ikony vlajek
const CzechFlag = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="6" fill="#11457E"/>
    <rect y="6" width="16" height="6" fill="#fff"/>
    <path d="M0 0L8 6L0 12V0Z" fill="#D7141A"/>
  </svg>
);

const SlovakFlag = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="4" fill="#fff"/>
    <rect y="4" width="16" height="4" fill="#0B4EA2"/>
    <rect y="8" width="16" height="4" fill="#EE1C25"/>
    {/* Dvojitý kříž uprostřed */}
    <path d="M6 3L7 3L7 4L8 4L8 5L7 5L7 6L6 6L6 5L5 5L5 4L6 4Z" fill="#0B4EA2"/>
    <path d="M6 2L7 2L7 3L6 3Z" fill="#0B4EA2"/>
    <path d="M6 6L7 6L7 7L6 7Z" fill="#0B4EA2"/>
  </svg>
);

export default function LocaleSwitch() {
  const { locale, setLocale, isCzech, isSlovak } = useLocale();

  return (
    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
      <button
        onClick={() => setLocale('sk')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isSlovak
            ? 'text-white shadow-lg border-2 border-green-700'
            : 'bg-transparent text-green-700 border-2 border-green-700 hover:bg-green-700/10'
        }`}
        style={{ 
          minWidth: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          background: isSlovak 
            ? 'linear-gradient(135deg, #1a5f3a 0%, #4a7c59 50%, #6b8e7a 100%)'
            : 'transparent'
        }}
      >
        <SlovakFlag />
        <span className="font-semibold">SK</span>
      </button>
      <button
        onClick={() => setLocale('cs')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isCzech
            ? 'text-white shadow-lg border-2 border-green-700'
            : 'bg-transparent text-green-700 border-2 border-green-700 hover:bg-green-700/10'
        }`}
        style={{ 
          minWidth: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          background: isCzech 
            ? 'linear-gradient(135deg, #1a5f3a 0%, #4a7c59 50%, #6b8e7a 100%)'
            : 'transparent'
        }}
      >
        <CzechFlag />
        <span className="font-semibold">CZ</span>
      </button>
    </div>
  );
} 