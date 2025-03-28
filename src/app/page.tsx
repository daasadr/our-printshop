import Link from 'next/link';
import LatestProducts from '@/components/LatestProducts';
import NewsletterSignup from '@/components/NewsletterSignup';
import CategoryTiles from '@/components/CategoryTiles';

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

      <CategoryTiles categories={[
  {
    id: 'home-decor',
    name: 'home-decor',
    displayName: 'Domov a dekorace',
    imagePlaceholder: 'Domov',
    image: '/images/categories/home-decor.jpg'
  },
  {
    id: 'women',
    name: 'women',
    displayName: 'Stylově pro dámy',
    imagePlaceholder: 'Ženy',
    image: '/images/categories/women.jpg'
  },
  {
    id: 'men',
    name: 'men',
    displayName: 'Pánská kolekce',
    imagePlaceholder: 'Muži',
    image: '/images/categories/men.jpg'
  },
  {
    id: 'kids',
    name: 'kids',
    displayName: 'Pro malé objevitele',
    imagePlaceholder: 'Děti',
    image: '/images/categories/kids.jpg'
  }
]} />

    

      {/* Nejnovější produkty */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nejnovější produkty</h2>
          <LatestProducts limit = {4}/>
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