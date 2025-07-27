'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export type Locale = 'cs' | 'sk' | 'en' | 'de';
export type Currency = 'CZK' | 'EUR' | 'GBP';

interface LocaleContextType {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
  isCzech: boolean;
  isSlovak: boolean;
  isEnglish: boolean;
  isGerman: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  
  // Získat jazyk z URL parametra
  const urlLang = params?.lang as Locale;
  const validLocales: Locale[] = ['cs', 'sk', 'en', 'de'];
  const defaultLocale: Locale = 'cs';
  
  const [locale, setLocaleState] = useState<Locale>(urlLang && validLocales.includes(urlLang) ? urlLang : defaultLocale);
  const [currency, setCurrencyState] = useState<Currency>('CZK');

  // Synchronizovat s URL parametrem
  useEffect(() => {
    if (urlLang && validLocales.includes(urlLang) && urlLang !== locale) {
      setLocaleState(urlLang);
    }
  }, [urlLang, locale]);

  // Automaticky nastavit měnu podle jazyka
  useEffect(() => {
    let newCurrency: Currency = 'CZK';
    
    if (locale === 'sk') {
      newCurrency = 'EUR';
    } else if (locale === 'en') {
      newCurrency = 'GBP';
    } else if (locale === 'de') {
      newCurrency = 'EUR';
    } else {
      newCurrency = 'CZK';
    }
    
    if (newCurrency !== currency) {
      setCurrencyState(newCurrency);
      localStorage.setItem('currency', newCurrency);
    }
  }, [locale, currency]);

  // Načtení z localStorage při startu (len ak nie je v URL)
  useEffect(() => {
    if (!urlLang) {
      const savedLocale = localStorage.getItem('locale') as Locale;
      const savedCurrency = localStorage.getItem('currency') as Currency;
      
      if (savedLocale && validLocales.includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
      
      if (savedCurrency && (savedCurrency === 'CZK' || savedCurrency === 'EUR' || savedCurrency === 'GBP')) {
        setCurrencyState(savedCurrency);
      }
    }
  }, [urlLang]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Navigovat na nový jazyk
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(cs|sk|en|de)/, '');
    router.push(`/${newLocale}${pathWithoutLang}`);
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const value: LocaleContextType = {
    locale,
    currency,
    setLocale,
    setCurrency,
    isCzech: locale === 'cs',
    isSlovak: locale === 'sk',
    isEnglish: locale === 'en',
    isGerman: locale === 'de',
  };

  return (
    <LocaleContext.Provider value={value} suppressHydrationWarning>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
} 