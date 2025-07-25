import NewsletterSignup from '@/components/NewsletterSignup';

interface NewsletterSectionProps {
  dictionary: any;
  lang: string;
}

export default function NewsletterSection({ dictionary, lang }: NewsletterSectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#1a2a1b] via-[#3a4a3b] to-[#1a2a1b] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {dictionary.newsletter?.title || "Zůstaňte v obraze"}
          </h2>
          <p className="text-gray-200 mb-8">
            {dictionary.newsletter?.subtitle || "Přihlaste se k odběru našeho newsletteru a buďte první, kdo se dozví o nových designech a speciálních nabídkách."}
          </p>
          <NewsletterSignup dictionary={dictionary} lang={lang} />
        </div>
      </div>
    </div>
  );
} 