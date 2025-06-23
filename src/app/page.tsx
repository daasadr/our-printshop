export const dynamic = "force-dynamic";

import Link from 'next/link';
import Image from 'next/image';
import LatestProducts from '@/components/LatestProducts';
import NewsletterSignup from '@/components/NewsletterSignup';
import CategoryTiles from '@/components/CategoryTiles';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-emerald-50 via-amber-50 to-teal-50">
      {/* Hero sekce */}
      <section className="relative min-h-[600px] flex items-center text-white overflow-hidden">
        {/* Obrázek na pozadí */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/tropical-jungle.jpg"
            alt="Tropical Jungle Background"
            fill
            className="object-cover"
            priority
          />
          {/* Tmavý overlay pro lepší čitelnost textu */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Originální oblečení s autorskými potisky</h1>
            <p className="text-xl mb-8">
              Vyjádřete svůj jedinečný styl s našimi kreativními designy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                Prohlédnout kolekci
              </Link>
              <Link 
                href="/about" 
                className="px-6 py-3 bg-transparent text-white border border-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                Náš příběh
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Kategorie a nejnovější produkty s khaki gradientem */}
      <div className="bg-gradient-to-br from-[#1a2a1b] via-[#3a4a3b] to-[#1a2a1b] text-white py-16">
        {/* Kategorie */}
        <div className="mb-24">
          <Suspense fallback={<div className="text-center text-white">Načítám kategorie...</div>}>
            <CategoryTiles />
          </Suspense>
        </div>

        {/* Nejnovější produkty */}
        <div>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nejnovější produkty</h2>
            <LatestProducts limit={4} />
          </div>
        </div>
      </div>

      {/* Výzva k akci s vlastním gradientem */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Připraveni vyjádřit svůj styl?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Prozkoumejte naši kolekci a najděte design, který vás vystihuje. Každý produkt je vyroben s péčí a láskou k detailu.
          </p>
          <Link 
            href="/products" 
            className="inline-block px-8 py-4 bg-white text-emerald-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            Nakupovat teď
          </Link>
        </div>
      </section>

      {/* Newsletter signup s khaki gradientem */}
      <div className="bg-gradient-to-br from-[#1a2a1b] via-[#3a4a3b] to-[#1a2a1b] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Zůstaňte v obraze</h2>
            <p className="text-gray-200 mb-8">
              Přihlaste se k odběru novinek a buďte první, kdo se dozví o nových designech a speciálních nabídkách.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </div>
  );
}