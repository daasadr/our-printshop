export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import CartContent from '@/components/CartContent';

export const metadata: Metadata = {
  title: 'Košík | HappyWilderness',
  description: 'Zobrazit a upravit položky v košíku',
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900/90 to-green-800/90">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Košík</h1>
        <CartContent />
      </div>
    </main>
  );
} 