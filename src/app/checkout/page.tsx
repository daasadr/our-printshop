'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm';
import { CartWithItems } from '@/types/prisma';
import { CartItem as SimpleCartItem } from '@/types/cart';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          if (response.status === 401) {
            // Pokud není uživatel přihlášen, přesměrujeme ho na přihlášení
            router.push('/auth/signin');
            return;
          }
          throw new Error('Nepodařilo se načíst košík');
        }
        const data: CartWithItems = await response.json();
        
        if (!data || !data.items || data.items.length === 0) {
          router.push('/cart');
          return;
        }

        setCart(data);
        // Vypočítat celkovou cenu
        const cartTotal = data.items.reduce((sum, item) => {
          return sum + (item.variant.price * item.quantity);
        }, 0);
        setTotal(cartTotal);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Něco se pokazilo');
      }
    };

    fetchCart();
  }, [router]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Chyba</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/cart')}
            className="text-green-600 hover:text-green-700"
          >
            Zpět do košíku
          </button>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
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