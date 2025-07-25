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

const EnglishFlag = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="12" fill="#012169"/>
    <path d="M0 0L16 12M16 0L0 12" stroke="#fff" strokeWidth="2"/>
    <path d="M0 0L16 12M16 0L0 12" stroke="#C8102E" strokeWidth="1"/>
    <path d="M8 0V12M0 6H16" stroke="#fff" strokeWidth="3"/>
    <path d="M8 0V12M0 6H16" stroke="#C8102E" strokeWidth="2"/>
  </svg>
);

const GermanFlag = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="4" fill="#000"/>
    <rect y="4" width="16" height="4" fill="#DD0000"/>
    <rect y="8" width="16" height="4" fill="#FFCE00"/>
  </svg>
);

export default function LocaleSwitch() {
  const { locale, setLocale, isCzech, isSlovak, isEnglish, isGerman } = useLocale();

  const getButtonStyle = (isActive: boolean) => ({
    minWidth: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s',
    background: isActive 
      ? 'linear-gradient(135deg, #1a5f3a 0%, #4a7c59 50%, #6b8e7a 100%)'
      : 'transparent',
    color: isActive ? 'white' : '#1a5f3a',
    border: `2px solid #1a5f3a`,
    cursor: 'pointer',
  });

  return (
    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1" suppressHydrationWarning>
      <button
        onClick={() => setLocale('cs')}
        style={getButtonStyle(isCzech)}
        title="Čeština"
      >
        <CzechFlag />
        <span>CZ</span>
      </button>
      
      <button
        onClick={() => setLocale('sk')}
        style={getButtonStyle(isSlovak)}
        title="Slovenčina"
      >
        <SlovakFlag />
        <span>SK</span>
      </button>
      
      <button
        onClick={() => setLocale('en')}
        style={getButtonStyle(isEnglish)}
        title="English"
      >
        <EnglishFlag />
        <span>EN</span>
      </button>
      
      <button
        onClick={() => setLocale('de')}
        style={getButtonStyle(isGerman)}
        title="Deutsch"
      >
        <GermanFlag />
        <span>DE</span>
      </button>
    </div>
  );
} 