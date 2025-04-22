import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Objednávka zrušena | Our Printshop',
  description: 'Vaše objednávka byla zrušena',
};

export default function OrderCancelledPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Objednávka byla zrušena
        </h1>
        <p className="text-lg mb-8">
          Platba nebyla dokončena a objednávka byla zrušena.
          Pokud chcete, můžete to zkusit znovu nebo nás kontaktovat v případě problémů.
        </p>
        <div className="space-x-4">
          <Link
            href="/checkout"
            className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-md hover:bg-indigo-700"
          >
            Zkusit znovu
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-600 text-white py-3 px-8 rounded-md hover:bg-gray-700"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
} 