import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import path from 'path';
import fs from 'fs/promises';
import { i18n } from '../../../../../next-i18next.config.js';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        if (typeof result !== 'object' || result === null || !k in result) {
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
    const { email, lang: bodyLang } = await request.json();

    if (!email) {
      return NextResponse.json({ messageKey: 'newsletter.error.email_required' }, { status: 400 });
    }

    const lang = bodyLang || i18n.defaultLocale;
    const t = await getTranslations(lang);
    
    try {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${lang}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
      
      await resend.emails.send({
        from: 'HappyWilderness <onboarding@resend.dev>',
        to: email,
        subject: t('newsletter.email_subject'),
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
            <p>${t('newsletter.email_greeting')}</p>
            <p>${t('newsletter.email_body')}</p>
            <br/>
            <p style="font-size: 14px; color: #555;">
              ${t('newsletter.email_unsubscribe_info')}<br/>
              <a href="${unsubscribeUrl}" style="color: #007bff; text-decoration: none;">${t('newsletter.email_unsubscribe_link')}</a>
            </p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999;">
              HappyWilderness
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Resend email error:', emailError);
      return NextResponse.json({ messageKey: 'newsletter.error.subscription_failed' }, { status: 500 });
    }

    return NextResponse.json({ messageKey: 'newsletter.success' }, { status: 200 });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ messageKey: 'newsletter.error.generic' }, { status: 500 });
  }
}