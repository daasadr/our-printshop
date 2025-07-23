import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  dictionary: any;
  lang: string;
}

export default function HeroSection({ dictionary, lang }: HeroSectionProps) {
  return (
    <section className="relative min-h-[600px] flex items-center text-white overflow-hidden">
      {/* Obrázek na pozadí */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tropical-jungle.jpg"
          alt={dictionary.about?.hero_alt || "Tropical Jungle Background"}
          fill
          className="object-cover"
          priority
        />
        {/* Tmavý overlay pro lepší čitelnost textu */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {dictionary.welcome || "Originální oblečení s autorskými potisky"}
          </h1>
          <p className="text-xl mb-8">
            {dictionary.subtitle || "Vyjádřete svůj jedinečný styl s našimi kreativními designy."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/${lang}/products`}
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              {dictionary.cta_collection || "Prohlédnout kolekci"}
            </Link>
            <Link 
              href={`/${lang}/about`}
              className="px-6 py-3 bg-transparent text-white border border-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              {dictionary.cta_story || "Náš příběh"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 