import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const initI18next = async (locale: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: 'cs',
      supportedLngs: ['cs', 'sk', 'en', 'de'],
      ns,
      defaultNS: 'common',
      fallbackNS: 'common',
    });
  return i18nInstance;
};

export default initI18next; 