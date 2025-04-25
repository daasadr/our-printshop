'use client';

import { useEffect, useState } from 'react';
import CheckoutForm from '@/components/CheckoutForm';
import { CartWithItems } from '@/types/prisma';
import { CartItem as SimpleCartItem } from '@/types/cart';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
        // Vypočítat celkovou cenu
        const cartTotal = data.items.reduce((sum: number, item: CartWithItems['items'][0]) => {
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

  // Transformace položek košíku do jednodušší struktury pro CheckoutForm
  const simpleCartItems: SimpleCartItem[] = cart.items.map(item => ({
    variantId: item.variant.id,
    quantity: item.quantity,
    name: item.variant.name,
    price: item.variant.price,
    image: item.variant.product.previewUrl
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dokončení objednávky</h1>
        <CheckoutForm cartItems={simpleCartItems} total={total} />
      </div>
    </div>
  );
} 