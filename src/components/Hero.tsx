"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
// import Image from "next/image"; // We'll use the standard <img> tag
import { useState } from "react";
import { useTranslation } from "next-i18next";

export default function Hero() {
  const params = useParams();
  const lang = (params?.lang as string) || "cs";
  const [showStory, setShowStory] = useState(false);
  const { t } = useTranslation('common');

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/tropical-jungle.jpg"
          alt={t('about.hero_alt')}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-2" style={{textShadow: '0 4px 24px #000, 0 1px 2px #000'}}>HappyWilderness</h1>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
      <p className="text-xl mb-8">{t('description')}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
        <Link
          href={`/${lang}/products`}
          className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors border border-gray-300"
        >
          {t('cta_collection')}
        </Link>
        <button
          type="button"
          onClick={() => setShowStory(true)}
          className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
        >
          {t('cta_story')}
        </button>
      </div>

      {/* Modal pre Náš příběh */}
      {showStory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg max-w-3xl w-full p-8">
              <button
                onClick={() => setShowStory(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                {t('close')}
              </button>
              <div className="prose max-w-none">
                <h2 className="text-3xl font-bold mb-6">{t('about.story_title')}</h2>
                <p className="text-gray-600">{t('about.story')}</p>
                <blockquote className="mt-6 border-l-4 border-gray-300 pl-4 italic">
                  {t('about.quote')}
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 