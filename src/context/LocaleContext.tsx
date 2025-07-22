'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Locale = 'cs' | 'sk';
export type Currency = 'CZK' | 'EUR';

interface LocaleContextType {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
  isCzech: boolean;
  isSlovak: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('cs');
  const [currency, setCurrencyState] = useState<Currency>('CZK');

  // Načtení z localStorage při startu
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    const savedCurrency = localStorage.getItem('currency') as Currency;
    
    if (savedLocale && (savedLocale === 'cs' || savedLocale === 'sk')) {
      setLocaleState(savedLocale);
    }
    
    if (savedCurrency && (savedCurrency === 'CZK' || savedCurrency === 'EUR')) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Automaticky nastavit měnu podle jazyka
    if (newLocale === 'sk') {
      setCurrency('EUR');
    } else {
      setCurrency('CZK');
    }
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