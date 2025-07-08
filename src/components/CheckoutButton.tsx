'use client';

import { useState } from 'react';
import { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/Button';

interface CheckoutButtonProps {
  cartItems: CartItem[];
  total: number;
}

export default function CheckoutButton({ cartItems, total }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error('Chyba při vytváření objednávky');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Došlo k chybě při zpracování objednávky. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      variant="primary"
      size="md"
      width="full"
      state={isLoading ? 'loading' : 'default'}
    >
      {isLoading ? 'Zpracování...' : 'Pokračovat k platbě'}
    </Button>
  );
} 