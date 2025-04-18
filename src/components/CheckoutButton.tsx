'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Inicializace Stripe s vaším veřejným klíčem
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  items: any[];
  shippingInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  disabled?: boolean;
}

export default function CheckoutButton({ items, shippingInfo, disabled = false }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // Vytvoříme Checkout Session
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingInfo,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        console.error('Error creating checkout session:', error);
        alert('Nepodařilo se vytvořit platební session. Zkuste to prosím později.');
        return;
      }

      // Získáme Stripe instanci
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Přesměrujeme na Checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        console.error('Error redirecting to checkout:', result.error);
        alert('Nepodařilo se přesměrovat na platební bránu. Zkuste to prosím později.');
      }
    } catch (error) {
      console.error('Error in checkout process:', error);
      alert('Nastala chyba při zpracování platby. Zkuste to prosím později.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
        disabled || isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {isLoading ? 'Zpracovávám...' : 'Zaplatit'}
    </button>
  );
} 