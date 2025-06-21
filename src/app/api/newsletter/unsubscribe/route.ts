import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { i18n } from '../../../../../next-i18next.config.js';

const getTranslations = async (lang: string) => {
  const supportedLangs = i18n.locales;
  const targetLang = supportedLangs.includes(lang) ? lang : i18n.defaultLocale;
  const filePath = path.join(process.cwd(), `public/locales/${targetLang}/common.json`);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const translations = JSON.parse(fileContent);
    
    return (key: string): string => {
      const keys = key.split('.');
      let result = translations;
      for (const k of keys) {
        if (typeof result !== 'object' || result === null || !(k in result)) {
            return key;
        }
        result = result[k];
      }
      return typeof result === 'string' ? result : key;
    };
  } catch (error) {
    console.error(`Could not load translations for lang: ${targetLang}`, error);
    // Fallback to just returning the key if file fails to load
    return (key: string) => key;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { email, reason } = await request.json();

    if (!email) {
      const langHeader = request.headers.get('accept-language');
      const lang = langHeader ? langHeader.split(',')[0].split('-')[0] : i18n.defaultLocale;
      const t = await getTranslations(lang);
      
      return NextResponse.json({ messageKey: t('newsletter.error.email_required') }, { status: 400 });
    }

    // Tu by v reálnej aplikácii prišla logika pre odstránenie e-mailu z databázy
    // a zaznamenanie dôvodu odhlásenia.
    // Pre účely dema len logujeme dáta a vrátime úspešnú odpoveď.
    console.log(`Unsubscribing email: ${email}, Reason: ${reason || 'Not specified'}`);

    const langHeader = request.headers.get('accept-language');
    const lang = langHeader ? langHeader.split(',')[0].split('-')[0] : i18n.defaultLocale;
    const t = await getTranslations(lang);

    return NextResponse.json({ messageKey: t('newsletter.unsubscribe_success') }, { status: 200 });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    const langHeader = request.headers.get('accept-language');
    const lang = langHeader ? langHeader.split(',')[0].split('-')[0] : i18n.defaultLocale;
    const t = await getTranslations(lang);
    
    return NextResponse.json({ messageKey: t('newsletter.error.generic') }, { status: 500 });
  }
} 