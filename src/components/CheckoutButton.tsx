'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

<<<<<<< HEAD
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
=======
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
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

<<<<<<< HEAD
      // 1. Vytvořit Checkout Session
      const response = await fetch('/api/checkout', {
=======
      // Vytvoříme Checkout Session
      const response = await fetch('/api/create-payment-intent', {
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingInfo,
        }),
      });

<<<<<<< HEAD
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
=======
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
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
<<<<<<< HEAD
      disabled={isLoading}
      className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
=======
      disabled={disabled || isLoading}
      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
        disabled || isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      }`}
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
    >
      {isLoading ? 'Zpracovávám...' : 'Zaplatit'}
    </button>
  );
} 