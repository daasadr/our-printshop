import 'server-only';

const dictionaries = {
  cs: () => import('../dictionaries/cs.json').then((module) => module.default || module),
  sk: () => import('../dictionaries/sk.json').then((module) => module.default || module),
  de: () => import('../dictionaries/de.json').then((module) => module.default || module),
  en: () => import('../dictionaries/en.json').then((module) => module.default || module),
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