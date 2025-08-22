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
  const validLocales: Locale[] = React.useMemo(() => ['cs', 'sk', 'en', 'de'], []);
  const defaultLocale: Locale = 'cs';
  
  // Flag pro kontrolu, zda už byl jazyk inicializován
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Inicializace jazyka - preferujeme localStorage, pak URL, pak default
  const getInitialLocale = (): Locale => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && validLocales.includes(savedLocale)) {
        console.log('LocaleContext - Using saved language from localStorage:', savedLocale);
        return savedLocale;
      }
    }
    
    if (urlLang && validLocales.includes(urlLang)) {
      console.log('LocaleContext - Using URL language:', urlLang);
      return urlLang;
    }
    
    console.log('LocaleContext - Using default language:', defaultLocale);
    return defaultLocale;
  };
  
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale());
  const [currency, setCurrencyState] = useState<Currency>('CZK');

  // Synchronizovat s URL parametrem a localStorage
  useEffect(() => {
    if (urlLang && validLocales.includes(urlLang)) {
      console.log('LocaleContext - Syncing with URL language:', urlLang, 'current locale:', locale);
      if (urlLang !== locale) {
        setLocaleState(urlLang);
        localStorage.setItem('locale', urlLang);
        setHasInitialized(true);
      }
    } else if (!urlLang && typeof window !== 'undefined') {
      // Pokud není URL jazyk, VŽDY obnovit jazyk z localStorage
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && validLocales.includes(savedLocale)) {
        console.log('LocaleContext - No URL language, restoring from localStorage:', savedLocale);
        if (savedLocale !== locale) {
          console.log('LocaleContext - Updating locale from', locale, 'to', savedLocale);
          setLocaleState(savedLocale);
        }
      }
    }
  }, [urlLang, validLocales, locale]);

  // Dodatečná kontrola - pokud není URL jazyk, obnovit jazyk z localStorage
  useEffect(() => {
    if (!urlLang && typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && validLocales.includes(savedLocale) && savedLocale !== locale) {
        console.log('LocaleContext - Additional check: restoring from localStorage:', savedLocale);
        setLocaleState(savedLocale);
      }
    }
  }, [urlLang, validLocales, locale]);

  // Automaticky nastavit měnu podle jazyka
  useEffect(() => {
    console.log('LocaleContext - Setting currency based on locale:', { locale, currentCurrency: currency });
    
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
    
    console.log('LocaleContext - New currency calculated:', { locale, newCurrency, currentCurrency: currency });
    
    if (newCurrency !== currency) {
      console.log('LocaleContext - Updating currency from', currency, 'to', newCurrency);
      setCurrencyState(newCurrency);
      localStorage.setItem('currency', newCurrency);
    } else {
      console.log('LocaleContext - Currency unchanged:', currency);
    }
  }, [locale, currency]);

  // Načtení měny z localStorage při startu
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('currency') as Currency;
      console.log('LocaleContext - Loading currency from localStorage:', savedCurrency);
      if (savedCurrency && (savedCurrency === 'CZK' || savedCurrency === 'EUR' || savedCurrency === 'GBP')) {
        console.log('LocaleContext - Setting currency from localStorage:', savedCurrency);
        setCurrencyState(savedCurrency);
      } else {
        console.log('LocaleContext - No valid currency in localStorage, will use default');
      }
    }
  }, []);

  const setLocale = React.useCallback((newLocale: Locale) => {
    console.log('LocaleContext - setLocale called with:', newLocale);
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Rýchle prepínanie jazyka pomocou window.location.href
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(cs|sk|en|de)/, '');
    window.location.href = `/${newLocale}${pathWithoutLang}`;
  }, []);

  const setCurrency = React.useCallback((newCurrency: Currency) => {
    console.log('LocaleContext - setCurrency called with:', newCurrency);
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  }, []);

  const value: LocaleContextType = React.useMemo(() => ({
    locale,
    currency,
    setLocale,
    setCurrency,
    isCzech: locale === 'cs',
    isSlovak: locale === 'sk',
    isEnglish: locale === 'en',
    isGerman: locale === 'de',
  }), [locale, currency, setLocale, setCurrency]);

  console.log('LocaleContext - Current state:', { 
    locale, 
    currency, 
    urlLang, 
    hasUrlLang: !!urlLang,
    hasInitialized,
    localStorageLocale: typeof window !== 'undefined' ? localStorage.getItem('locale') : 'N/A'
  });

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