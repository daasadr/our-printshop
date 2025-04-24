'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';
import { CartWithItems } from '@/types/prisma';

export const metadata: Metadata = {
  title: 'Dokončení objednávky | Our Print Shop',
  description: 'Dokončete svou objednávku v Our Print Shop',
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
        // Vypočítat celkovou cenu
        const cartTotal = data.items.reduce((sum: number, item: any) => {
          return sum + (item.variant.price * item.quantity);
        }, 0);
        setTotal(cartTotal);
      }
    };

    fetchCart();
  }, []);

  if (!cart) {
    return <div>Načítání...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dokončení objednávky</h1>
        <CheckoutForm cartItems={cart.items} total={total} />
      </div>
    </div>
  );
} 