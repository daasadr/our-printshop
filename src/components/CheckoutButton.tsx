'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Inicializace Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  shippingInfo: {
    name: string;
    email: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    country: string;
    zip: string;
    phone?: string;
  };
}

export default function CheckoutButton({ items, shippingInfo }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // 1. Vytvořit Checkout Session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingInfo,
        }),
      });

      const { sessionId } = await response.json();

      // 2. Přesměrovat na Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Došlo k chybě při zpracování platby. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
    >
      {isLoading ? 'Zpracovávám...' : 'Zaplatit'}
    </button>
  );
} 