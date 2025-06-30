export const dynamic = "force-dynamic";

import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Zásady ochrany soukromí | HappyWilderness',
  description: 'Informace o tom, jak zpracováváme vaše osobní údaje a chráníme vaše soukromí.'
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen relative">
      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/tropical.jpg"
          alt="Tropical Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Zásady ochrany soukromí</h1>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Úvod</h2>
              <p className="text-gray-700 mb-4">
                Vítejte na stránkách HappyWilderness. Ochrana vašeho soukromí je pro nás prioritou. 
                Tyto zásady ochrany soukromí vysvětlují, jak shromažďujeme, používáme a chráníme vaše osobní údaje.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Jaké údaje shromažďujeme</h2>
              <p className="text-gray-700 mb-4">Shromažďujeme následující údaje:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Jméno a příjmení</li>
                <li>Kontaktní údaje (e-mail, telefon)</li>
                <li>Doručovací adresa</li>
                <li>Historie objednávek</li>
                <li>Informace o newsletteru</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Jak používáme vaše údaje</h2>
              <p className="text-gray-700 mb-4">Vaše údaje používáme pro:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Zpracování a doručení vašich objednávek</li>
                <li>Komunikaci ohledně objednávek</li>
                <li>Zasílání newsletteru (pouze s vaším souhlasem)</li>
                <li>Zlepšování našich služeb</li>
                <li>Plnění zákonných povinností</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Ochrana údajů</h2>
              <p className="text-gray-700 mb-4">
                Vaše údaje jsou u nás v bezpečí. Implementovali jsme technická a organizační opatření 
                pro zajištění bezpečnosti vašich dat. Přístup k osobním údajům mají pouze oprávněné osoby.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Vaše práva</h2>
              <p className="text-gray-700 mb-4">Máte právo na:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Přístup k vašim údajům</li>
                <li>Opravu nepřesných údajů</li>
                <li>Výmaz údajů</li>
                <li>Omezení zpracování</li>
                <li>Přenositelnost údajů</li>
                <li>Vznesení námitky proti zpracování</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Používáme cookies pro zlepšení funkčnosti našeho webu a poskytování lepších služeb. 
                Více informací o používání cookies najdete v našich zásadách používání cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Kontaktujte nás</h2>
              <p className="text-gray-700 mb-4">
                Pokud máte jakékoliv dotazy ohledně zpracování vašich osobních údajů, 
                neváhejte nás kontaktovat na e-mailu: info@happywilderness.cz
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">8. Změny zásad</h2>
              <p className="text-gray-700">
                Vyhrazujeme si právo tyto zásady ochrany soukromí kdykoliv upravit. 
                O významných změnách vás budeme informovat.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
} 