"use client";

import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import Navigation from './Navigation';
import { HeaderActions } from './HeaderActions';
import { useLocale } from '@/context/LocaleContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { locale } = useLocale();

  // Sledování scrollu pro změnu stylu headeru
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Načtení dictionary pro aktuální jazyk
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await import(`../../../public/locales/${locale}/common.json`);
        setDictionary(dict.default);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };

    loadDictionary();
  }, [locale]);

  return (
    <header
      role="banner"
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-3'
      }`}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4">
        {/* Desktop layout - xl a větší */}
        <div className="hidden xl:flex items-center justify-between relative">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Navigation - center */}
          <div className="flex-1 flex justify-center px-8">
            <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} dictionary={dictionary} />
          </div>
          
          {/* Actions - right */}
          <div className="flex-shrink-0 relative">
            <HeaderActions isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
        </div>

        {/* Tablet a Mobile layout - menší než xl */}
        <div className="xl:hidden">
          <div className="flex items-center justify-between relative">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Actions - right (s hamburger menu) */}
            <div className="flex-shrink-0 relative">
              <HeaderActions isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isMobile={true} />
            </div>
          </div>
        </div>
        
        {/* Mobile/Tablet navigation - pod hlavním řádkem pro všechny menší než xl */}
        <div className="xl:hidden mt-3">
          <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
};

export { Header};