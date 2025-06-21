import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Objednávka zrušena | Our Printshop',
  description: 'Vaše objednávka byla zrušena',
};

export default function OrderCancelledPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Objednávka zrušena</h1>
      <p className="text-gray-600 mb-8">
        Vaše objednávka byla zrušena. Pokud máte jakékoliv otázky, neváhejte nás kontaktovat.
      </p>
      <a
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Zpět na hlavní stránku
      </a>
    </div>
  );
} 