import { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Dokončení objednávky | Our Print Shop',
  description: 'Dokončete svou objednávku v Our Print Shop',
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dokončení objednávky</h1>
        <CheckoutForm />
      </div>
    </div>
  );
} 