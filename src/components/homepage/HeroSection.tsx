'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  dictionary: any;
  lang: string;
}

export default function HeroSection({ dictionary, lang }: HeroSectionProps) {
  const [user, setUser] = useState<any>(null);

  // Načteme informace o uživateli při mount
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <section className="relative min-h-[600px] flex items-center text-white overflow-hidden parallax">
      {/* Obrázek na pozadí */}
      <div className="absolute inset-0 z-0 parallax-layer-slow">
        <Image
          src="/images/tropical-jungle.jpg"
          alt={dictionary.about?.hero_alt || "Tropical Jungle Background"}
          fill
          className="object-cover"
          priority
        />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50 animate-pulse-slow" />
      </div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 parallax-layer">
        <div className="max-w-2xl mx-auto text-center">
          {/* Uvítání pro přihlášené uživatele */}
          {user && (
            <div className="mb-6 animate-float">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text-animated mb-2">
                {dictionary.welcome_back || "Vítejte!"}
              </h2>
              <p className="text-lg text-white/90">
                {dictionary.welcome_back_message?.replace('{name}', user.first_name || user.email) || 
                 `Jsme rádi, že jste zpět, ${user.first_name || user.email}`}
              </p>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animate-float-slow">
            {dictionary.welcome || "Originální oblečení s autorskými potisky"}
          </h1>
          <p className="text-xl mb-8 text-white/90">
            {dictionary.subtitle || "Vyjádřete svůj jedinečný styl s našimi kreativními designy."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/${lang}/products`}
              className="px-6 py-3 glass text-white font-medium rounded-md hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-pulse-glow"
            >
              {dictionary.cta_collection || "Prohlédnout kolekci"}
            </Link>
            <Link 
              href={`/${lang}/about`}
              className="px-6 py-3 glass-dark text-white border border-white/30 font-medium rounded-md hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              {dictionary.cta_story || "Náš příběh"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 