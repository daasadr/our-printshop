"use client";

import React, { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/context/LocaleContext';
import FAQContactModal from '@/components/FAQContactModal';
import ReturnsForm from '@/components/ReturnsForm';
import PageTransition from '@/components/PageTransition';

interface FAQPageProps {
  params: {
    lang: Locale;
  };
}

export default function FAQPage({ params: { lang } }: FAQPageProps) {
  const [dictionary, setDictionary] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isReturnsFormOpen, setIsReturnsFormOpen] = useState(false);

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
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {dictionary?.faq || 'FAQ'}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {dictionary?.faq_subtitle || 'Často kladené otázky o našich produktoch, doručení a službách'}
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Shipping Wait Time Section */}
            <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-100">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-6 lg:mb-8 border-b-2 border-blue-500 pb-3">
                📦 {dictionary?.faq_shipping_wait || 'Čakacia lehota a doručenie'}
              </h2>
              
              <div className="space-y-6 lg:space-y-8">
                {/* Question 1 */}
                <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_shipping_wait_title || 'Ako dlho trvá výroba a doručenie?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_shipping_wait_content || 'Naše produkty sa vyrábajú na objednávku cez Printful. Výroba trvá 2-7 pracovných dní, potom sa produkty odosielajú k vám. Celková doba doručenia je 7-14 dní od objednávky.'}
                  </p>
                </div>

                {/* Question 2 */}
                <div className="border-l-4 border-green-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_why_printful_title || 'Prečo produkty neprichádzajú hneď?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_why_printful_content || 'Používame Printful, ktorý vyrába produkty na objednávku. To nám umožňuje ponúkať široký výber dizajnov bez skladovania zásob.'}
                  </p>
                </div>

                {/* Question 3 */}
                <div className="border-l-4 border-purple-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_tracking_title || 'Kedy dostanem tracking číslo?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_tracking_content || 'Tracking číslo dostanete emailom hneď ako sa produkt začne vyrábať (zvyčajne do 24 hodín od objednávky).'}
                  </p>
                </div>
              </div>
            </section>

            {/* Shipping Section */}
            <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-100">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-6 lg:mb-8 border-b-2 border-green-500 pb-3">
                🚚 {dictionary?.faq_shipping || 'Doprava'}
              </h2>
              
              <div className="space-y-6 lg:space-y-8">
                {/* Question 1 */}
                <div className="border-l-4 border-green-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_shipping_title || 'Aké dopravné služby používate?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_shipping_content || 'Používame niekoľko dopravných služieb podľa regiónu: Packeta pre Českú republiku a Slovensko (1-2 dni, 2.99€), DHL Express pre celosvetovú dopravu (2-4 dni, 8.99€) a UPS Standard ako ekonomickú alternatívu (3-5 dní, 6.99€).'}
                  </p>
                </div>

                {/* Question 2 */}
                <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_delivery_time_title || 'Aká je celková doba dodania?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_delivery_time_content || 'Celková doba dodania sa skladá z výroby cez Printful (5-7 dní) a dopravy. Pre Českú republiku a Slovensko je to 6-9 dní, pre celý svet 7-12 dní.'}
                  </p>
                </div>

                {/* Question 3 */}
                <div className="border-l-4 border-purple-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_shipping_costs_title || 'Aké sú náklady na dopravu?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_shipping_costs_content || 'Doprava stojí 2.99€ pre Českú republiku a Slovensko (Packeta), 8.99€ pre celosvetovú dopravu (DHL Express) alebo 6.99€ pre ekonomickú celosvetovú dopravu (UPS Standard).'}
                  </p>
                </div>

                {/* Question 4 */}
                <div className="border-l-4 border-orange-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_tracking_info_title || 'Ako funguje sledovanie zásielky?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_tracking_info_content || 'Tracking číslo dostanete emailom do 24 hodín od objednávky. Môžete sledovať stav výroby aj dopravy až k doručeniu.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Returns Section */}
            <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-100">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-6 lg:mb-8 border-b-2 border-orange-500 pb-3">
                🔄 {dictionary?.faq_returns || 'Reklamácie a vrátenie'}
              </h2>
              
              <div className="space-y-6 lg:space-y-8">
                {/* Question 1 */}
                <div className="border-l-4 border-orange-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_returns_title || 'Ako fungujú reklamácie a vrátenie?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_returns_content || 'Poskytujeme 30-dňovú záruku na výrobu. Ak je problém na strane Printful (tlačové chyby, nesprávna veľkosť, poškodenie), poskytneme bezplatnú náhradu alebo refund. Zákazník platí dopravu len ak je problém na jeho strane.'}
                  </p>
                </div>

                {/* Question 2 */}
                <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_returns_process_title || 'Ako prebieha proces reklamácie?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_returns_process_content || '1. Kontaktujte nás s fotkami a popisom problému. 2. Vyhodnotíme situáciu a kontaktujeme Printful. 3. Po schválení vám zašleme náhradný produkt alebo refund. 4. Celý proces trvá 3-7 pracovných dní.'}
                  </p>
                </div>

                {/* Question 3 */}
                <div className="border-l-4 border-green-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_returns_photos_title || 'Aké fotografie potrebujete?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_returns_photos_content || 'Potrebujeme jasné fotografie problému z rôznych uhlov, číslo objednávky a dátum doručenia. Fotografie by mali ukazovať celý produkt a detail problému.'}
                  </p>
                </div>

                {/* Question 4 */}
                <div className="border-l-4 border-purple-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_returns_shipping_title || 'Kto platí dopravu pri reklamácii?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_returns_shipping_content || 'Ak je problém na strane Printful (tlačové chyby, poškodenie), dopravu platíme my. Ak je problém na strane zákazníka (nesprávna veľkosť, zmena názoru), dopravu platí zákazník.'}
                  </p>
                </div>

                {/* Question 5 */}
                <div className="border-l-4 border-red-500 pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3">
                    ❓ {dictionary?.faq_returns_time_title || 'Ako dlho trvá vybavenie reklamácie?'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {dictionary?.faq_returns_time_content || 'Vyhodnotenie reklamácie trvá 1-2 pracovné dni. Po schválení vám zašleme náhradný produkt do 5-7 pracovných dní alebo refund do 3-5 pracovných dní.'}
                  </p>
                </div>
              </div>

              {/* Returns Form Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsReturnsFormOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  📝 {dictionary?.submit_returns_form || 'Podat reklamáciu'}
                </button>
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <div className="mt-8 sm:mt-12 lg:mt-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 sm:p-8 lg:p-10 text-center border border-blue-200 shadow-lg">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6">
              {dictionary?.faq_contact_title || 'Stále máte otázky?'}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
              {dictionary?.faq_contact_text || 'Ak ste nenašli odpoveď na svoju otázku, neváhajte nás kontaktovať.'}
            </p>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
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

        {/* Reklamačný formulár */}
        {isReturnsFormOpen && (
          <ReturnsForm
            dictionary={dictionary}
            lang={lang}
            onClose={() => setIsReturnsFormOpen(false)}
          />
        )}
      </div>
    </PageTransition>
  );
}
