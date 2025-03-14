import Link from 'next/link';
import Image from 'next/image';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Home() {
  return (
    <div>
      {/* Hero sekce */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 z-0 opacity-60">
          {/* Overlay obrázku - můžete přidat vlastní obrázek */}
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900" />
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Originální oblečení s autorskými potisky</h1>
            <p className="text-xl mb-8">
              Vyjádřete svůj jedinečný styl s našimi kreativními designy. Každý kus je vyroben na míru právě pro vás.
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

      {/* Výhody */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kvalitní materiály</h3>
              <p className="text-gray-600">
                Používáme pouze prémiové materiály, které jsou šetrné k životnímu prostředí a příjemné na nošení.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Originální designy</h3>
              <p className="text-gray-600">
                Každý design je vytvořen s láskou a péčí. Vyjádřete svou osobnost s naší jedinečnou kolekcí.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vyrobeno na míru</h3>
              <p className="text-gray-600">
                Každý produkt je vyroben až po objednání, abychom minimalizovali odpad a maximalizovali personalzaci.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kategorie */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Naše kategorie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/products?category=tshirts" className="group">
              <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                <div className="absolute inset-0 bg-gray-200">
                  {/* Image placeholder */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                    Obrázek trička
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 transition-all group-hover:from-black/80">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Trička</h3>
                    <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      Prozkoumejte naši kolekci triček s originálními potisky.
                    </p>
                    <span className="inline-block px-4 py-2 border border-white text-white rounded-md">
                      Zobrazit
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=hoodies" className="group">
              <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                <div className="absolute inset-0 bg-gray-200">
                  {/* Image placeholder */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                    Obrázek mikiny
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 transition-all group-hover:from-black/80">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Mikiny</h3>
                    <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      Stylové a pohodlné mikiny pro každou příležitost.
                    </p>
                    <span className="inline-block px-4 py-2 border border-white text-white rounded-md">
                      Zobrazit
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=accessories" className="group">
              <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                <div className="absolute inset-0 bg-gray-200">
                  {/* Image placeholder */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                    Obrázek doplňků
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 transition-all group-hover:from-black/80">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Doplňky</h3>
                    <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      Hrnky, plakáty a další doplňky s vašimi oblíbenými designy.
                    </p>
                    <span className="inline-block px-4 py-2 border border-white text-white rounded-md">
                      Zobrazit
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Doporučené produkty */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Oblíbené produkty</h2>
          <FeaturedProducts />
        </div>
      </section>

      {/* Výzva k akci */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Připraveni vyjádřit svůj styl?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Prozkoumejte naši kolekci a najděte design, který vás vystihuje. Každý produkt je vyroben s péčí a láskou k detailu.
          </p>
          <Link 
            href="/products" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            Nakupovat teď
          </Link>
        </div>
      </section>

      {/* Přihlášení k odběru novinek */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Zůstaňte v obraze</h2>
            <p className="text-gray-600 mb-8">
              Přihlaste se k odběru novinek a buďte první, kdo se dozví o nových designech a speciálních nabídkách.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </div>
  );
}