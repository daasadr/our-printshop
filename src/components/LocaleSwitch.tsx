'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';

export default function LocaleSwitch() {
  const { locale, setLocale, isCzech, isSlovak } = useLocale();

  return (
    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
      <button
        onClick={() => setLocale('sk')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          isSlovak
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-white/30 text-white hover:bg-white/40 border border-white/20'
        }`}
        style={{ 
          minWidth: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}
      >
        <span role="img" aria-label="Slovenská vlajka" style={{ fontSize: '14px' }}>
          🇸🇰
        </span>
        <span>SK</span>
      </button>
      <button
        onClick={() => setLocale('cs')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          isCzech
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-white/30 text-white hover:bg-white/40 border border-white/20'
        }`}
        style={{ 
          minWidth: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}
      >
        <span role="img" aria-label="Česká vlajka" style={{ fontSize: '14px' }}>
          🇨🇿
        </span>
        <span>CZ</span>
      </button>
    </div>
  );
} 