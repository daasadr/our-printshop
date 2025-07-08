'use client';

import { useState } from 'react';
import { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/Button';

interface BuyButtonProps {
  items: CartItem[];
  className?: string;
}

export default function BuyButton({ items, className = '' }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingDetails: {
            // Základní údaje pro doručení, které budou doplněny v checkout formuláři
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zip: '',
            country: 'CZ',
          },
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
      onClick={handleBuy}
      disabled={isLoading || items.length === 0}
      variant="success"
      size="lg"
      state={isLoading ? 'loading' : 'default'}
      className={className}
    >
      {isLoading ? 'Zpracovávám...' : 'Koupit'}
    </Button>
  );
} 