import { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout | Our Printshop',
  description: 'Dokončete svoji objednávku',
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dokončení objednávky</h1>
      <CheckoutForm />
    </div>
  );
} 