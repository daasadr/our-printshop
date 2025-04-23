'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Inicializace Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  items: Array<{
    variantId: string;
    quantity: number;
    name: string;
    price: number;
    image?: string;
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
  disabled?: boolean;
  className?: string;
}

export default function CheckoutButton({ items, shippingInfo, disabled = false, className = '' }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // Vytvoříme checkout session
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Chyba při vytváření platební session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Chybí URL pro přesměrování na platební bránu');
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
      disabled={disabled || isLoading || items.length === 0}
      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
        disabled || isLoading || items.length === 0
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      } ${className}`}
    >
      {isLoading ? 'Zpracovávám...' : 'Zaplatit'}
    </button>
  );
} 