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
  
  // Inicializace jazyka - preferujeme localStorage, pak URL, pak default
  const getInitialLocale = (): Locale => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && validLocales.includes(savedLocale)) {
        return savedLocale;
      }
    }
    
    if (urlLang && validLocales.includes(urlLang)) {
      return urlLang;
    }
    
    return defaultLocale;
  };
  
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [currency, setCurrencyState] = useState<Currency>('CZK');

  // Synchronizovat s URL parametrem pouze při první návštěvě
  useEffect(() => {
    if (urlLang && validLocales.includes(urlLang) && !localStorage.getItem('locale')) {
      setLocaleState(urlLang);
      localStorage.setItem('locale', urlLang);
    }
  }, [urlLang]);

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

  // Načtení měny z localStorage při startu
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('currency') as Currency;
      if (savedCurrency && (savedCurrency === 'CZK' || savedCurrency === 'EUR' || savedCurrency === 'GBP')) {
        setCurrencyState(savedCurrency);
      }
    }
  }, []);

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
    <LocaleContext.Provider value={value}>
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