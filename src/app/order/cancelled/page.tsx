import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Objednávka zrušena | Our Printshop',
  description: 'Vaše objednávka byla zrušena',
};

export default function OrderCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Objednávka byla zrušena
        </h1>
        <p className="text-gray-600 mb-8">
          Platba nebyla dokončena a objednávka byla zrušena.
          Pokud chcete, můžete se vrátit do košíku a zkusit to znovu.
        </p>
        <div className="space-y-4">
          <a
            href="/cart"
            className="block text-blue-600 hover:text-blue-800 underline"
          >
            Zpět do košíku
          </a>
          <a
            href="/"
            className="block text-gray-600 hover:text-gray-800 underline"
          >
            Zpět na hlavní stránku
          </a>
        </div>
      </div>
    </div>
  );
} 