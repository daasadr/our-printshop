export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import CartContent from '@/components/CartContent';
import { getDictionary } from '@/lib/getDictionary';

interface CartPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: CartPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: `${dict.cart?.title || 'Košík'} | HappyWilderness`,
    description: dict.cart?.view_cart || 'Zobrazit a upravit položky v košíku',
  };
}

export default async function CartPage({ params }: CartPageProps) {
  const dict = await getDictionary(params.lang);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900/90 to-green-800/90">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          {dict.cart?.title || 'Košík'}
        </h1>
        <CartContent />
      </div>
    </main>
  );
} 