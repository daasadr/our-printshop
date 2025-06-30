import NewsletterSignup from '@/components/NewsletterSignup';

export default function NewsletterSection() {
  return (
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
  );
} 