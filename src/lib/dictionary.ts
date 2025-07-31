import 'server-only';

const dictionaries = {
  cs: () => import('../../public/locales/cs/common.json').then((module) => module.default || module),
  sk: () => import('../../public/locales/sk/common.json').then((module) => module.default || module),
  de: () => import('../../public/locales/de/common.json').then((module) => module.default || module),
  en: () => import('../../public/locales/en/common.json').then((module) => module.default || module),
};

export const getDictionary = async (locale: string) => {
  try {
    const lang = locale as keyof typeof dictionaries;
    const dictionary = await dictionaries[lang]?.();
    return dictionary || await dictionaries.cs();
  } catch (error) {
    console.error('Error loading dictionary for locale:', locale, error);
    // Fallback na český slovník
    return await dictionaries.cs();
  }
}; 