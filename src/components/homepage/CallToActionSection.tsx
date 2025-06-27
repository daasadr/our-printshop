import Link from 'next/link';

export default function CallToActionSection() {
  return (
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
  );
} 