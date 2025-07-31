'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react'; // ODSTRANĚNO
import CheckoutForm from '@/components/CheckoutForm';
import { CartItem as SimpleCartItem } from '@/types/cart';
import { useCart } from '@/hooks/useCart';

export default function CheckoutContent() {
  const router = useRouter();
  const { items: localCartItems, totalPrice: localTotalPrice } = useCart();
  const [serverCart, setServerCart] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // JWT Auth state
  const [user, setUser] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  // JWT Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          setAuthStatus('unauthenticated');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: accessToken }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthStatus('unauthenticated');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchServerCart = async () => {
      if (authStatus !== 'authenticated') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Nepodařilo se načíst košík');
        }
        const data: any = await response.json();
        
        if (!data || !data.items || data.items.length === 0) {
          router.push('/cart');
          return;
        }

        setServerCart(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Něco se pokazilo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServerCart();
  }, [router, authStatus]);

  // Pro nepřihlášené uživatele zkontrolujeme lokální košík
  if (authStatus === 'unauthenticated' && localCartItems.length === 0 && !isLoading) {
    router.push('/cart');
    return null;
  }

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

  if (isLoading) {
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

  // Použijeme buď serverový košík pro přihlášené uživatele, nebo lokální košík pro nepřihlášené
  const cartItems = user && serverCart ? 
    serverCart.items.map(item => ({
      variantId: item.variant.id,
      quantity: item.quantity,
      name: item.variant.name,
      price: item.variant.price,
      image: item.variant.product.previewUrl
    })) : localCartItems;

  const totalPrice = user && serverCart ? serverCart.totalPrice : localTotalPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dokončení objednávky</h1>
        <CheckoutForm 
          cartItems={cartItems} 
          totalPrice={totalPrice}
          user={user}
        />
      </div>
    </div>
  );
} 