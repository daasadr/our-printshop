import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Objednávka úspěšně dokončena | Our Printshop',
  description: 'Vaše objednávka byla úspěšně dokončena',
};

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Děkujeme za vaši objednávku!
        </h1>
        <p className="text-lg mb-8">
          Vaše objednávka byla úspěšně přijata a bude co nejdříve zpracována.
          O průběhu výroby a doručení vás budeme informovat emailem.
        </p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-md hover:bg-indigo-700"
        >
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  );
} 