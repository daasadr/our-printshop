"use client";

import React, { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n.config';
import FAQContactModal from '@/components/FAQContactModal';

interface FAQPageProps {
  params: {
    lang: Locale;
  };
}

export default function FAQPage({ params: { lang } }: FAQPageProps) {
  const [dictionary, setDictionary] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Načtení dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };
    loadDictionary();
  }, [lang]);

  if (!dictionary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {dictionary?.faq || 'FAQ'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {dictionary?.faq_subtitle || 'Často kladené otázky o našich produktoch, doručení a službách'}
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {/* Shipping Wait Time Section */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2">
              📦 {dictionary?.faq_shipping_wait || 'Čakacia lehota a doručenie'}
            </h2>
            
            <div className="space-y-6">
              {/* Question 1 */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  ❓ {dictionary?.faq_shipping_wait_title || 'Ako dlho trvá výroba a doručenie?'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {dictionary?.faq_shipping_wait_content || 'Naše produkty sa vyrábajú na objednávku cez Printful. Výroba trvá 2-7 pracovných dní, potom sa produkty odosielajú k vám. Celková doba doručenia je 7-14 dní od objednávky.'}
                </p>
              </div>

              {/* Question 2 */}
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  ❓ {dictionary?.faq_why_printful_title || 'Prečo produkty neprichádzajú hneď?'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {dictionary?.faq_why_printful_content || 'Používame Printful, ktorý vyrába produkty na objednávku. To nám umožňuje ponúkať široký výber dizajnov bez skladovania zásob.'}
                </p>
              </div>

              {/* Question 3 */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  ❓ {dictionary?.faq_tracking_title || 'Kedy dostanem tracking číslo?'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {dictionary?.faq_tracking_content || 'Tracking číslo dostanete emailom hneď ako sa produkt začne vyrábať (zvyčajne do 24 hodín od objednávky).'}
                </p>
              </div>
            </div>
          </section>

          {/* Coming Soon Sections */}
          <section className="bg-white rounded-lg shadow-md p-8 opacity-60">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">
              🚚 {dictionary?.faq_shipping || 'Doprava'}
            </h2>
            <p className="text-gray-600 italic">
              {dictionary?.faq_coming_soon_shipping || 'Informácie o doprave a Packeta službách budú čoskoro dostupné...'}
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8 opacity-60">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">
              💳 {dictionary?.faq_payments || 'Platby'}
            </h2>
            <p className="text-gray-600 italic">
              {dictionary?.faq_coming_soon_payments || 'Informácie o platobných metódach a bezpečnosti budú čoskoro dostupné...'}
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8 opacity-60">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">
              🔄 {dictionary?.faq_returns || 'Reklamácie a vrátenie'}
            </h2>
            <p className="text-gray-600 italic">
              {dictionary?.faq_coming_soon_returns || 'Informácie o reklamáciách a vrátení produktov budú čoskoro dostupné...'}
            </p>
          </section>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {dictionary?.faq_contact_title || 'Stále máte otázky?'}
          </h3>
          <p className="text-gray-700 mb-6">
            {dictionary?.faq_contact_text || 'Ak ste nenašli odpoveď na svoju otázku, neváhajte nás kontaktovať.'}
          </p>
          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {dictionary?.faq_contact_button || 'Kontaktovať podporu'}
          </button>
        </div>
      </div>
      
      {/* Kontaktný modál */}
      <FAQContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        dictionary={dictionary}
      />
    </div>
  );
}
