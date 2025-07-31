// import 'server-only'; // ODSTRANĚNO - potřebujeme to i pro client-side komponenty

const dictionaries = {
  cs: () => import('../../public/locales/cs/common.json').then((module) => module.default),
  sk: () => import('../../public/locales/sk/common.json').then((module) => module.default),
  en: () => import('../../public/locales/en/common.json').then((module) => module.default),
  de: () => import('../../public/locales/de/common.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const dictionary = dictionaries[locale as keyof typeof dictionaries];
  if (!dictionary) {
    return dictionaries.cs();
  }
  return dictionary();
}; 