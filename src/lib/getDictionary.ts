// Server-side načítání
const serverDictionaries = {
  cs: () => require('../../public/locales/cs/common.json'),
  sk: () => require('../../public/locales/sk/common.json'),
  en: () => require('../../public/locales/en/common.json'),
  de: () => require('../../public/locales/de/common.json'),
};

// Client-side načítání
const clientDictionaries = {
  cs: () => fetch('/locales/cs/common.json').then(res => res.json()),
  sk: () => fetch('/locales/sk/common.json').then(res => res.json()),
  en: () => fetch('/locales/en/common.json').then(res => res.json()),
  de: () => fetch('/locales/de/common.json').then(res => res.json()),
};

export const getDictionary = async (locale: string) => {
  try {
    // Detekce, jestli jsme na serveru nebo clientu
    const isServer = typeof window === 'undefined';
    const dictionaries = isServer ? serverDictionaries : clientDictionaries;
    
    const dictionary = dictionaries[locale as keyof typeof dictionaries];
    if (!dictionary) {
      return dictionaries.cs();
    }
    return await dictionary();
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error);
    // Fallback na český slovník
    const isServer = typeof window === 'undefined';
    const dictionaries = isServer ? serverDictionaries : clientDictionaries;
    return dictionaries.cs();
  }
}; 