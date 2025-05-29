import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function AboutPage() {
  const { t } = useTranslation('common');

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/jungle-bg.jpg"
          alt={t('about.hero_alt')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 container mx-auto py-16 px-4 text-white">
        <div className="max-w-3xl mx-auto bg-black/30 p-8 rounded-lg backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">{t('about.title')}</h1>
          
          <div className="space-y-6 text-lg">
            <p>{t('about.intro')}</p>
            
            <p>{t('about.team')}</p>
            
            <div className="my-8 flex justify-center">
              <div className="relative overflow-hidden rounded-lg w-full max-w-2xl h-80">
                <Image 
                  src="/images/OIG1.jpeg" 
                  alt={t('about.inspiration_alt')}
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            
            <p>{t('about.philosophy')}</p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">{t('about.values_title')}</h2>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>{t('about.values.originality.title')}</strong> - {t('about.values.originality.description')}</li>
              <li><strong>{t('about.values.quality.title')}</strong> - {t('about.values.quality.description')}</li>
              <li><strong>{t('about.values.sustainability.title')}</strong> - {t('about.values.sustainability.description')}</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-10 mb-4">{t('about.story_title')}</h2>
            
            <p>{t('about.story')}</p>
            
            <div className="mt-10 text-center">
              <p className="italic">{t('about.quote')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 