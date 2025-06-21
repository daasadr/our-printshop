"use client";

import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { useTranslation } from 'next-i18next';

export default function NewsletterPage() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('newsletter.subscribe_title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('newsletter.subscribe_subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
} 