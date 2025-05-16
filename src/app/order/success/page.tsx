'use client';

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderStatus, setOrderStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const checkOrder = async () => {
      try {
        if (!sessionId) {
          setOrderStatus('error');
          return;
        }

        // Zde můžeme přidat volání API pro kontrolu stavu objednávky
        setOrderStatus('success');
      } catch (error) {
        console.error('Error checking order:', error);
        setOrderStatus('error');
      }
    };

    checkOrder();
  }, [sessionId]);

  if (orderStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Zpracování objednávky...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (orderStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Něco se pokazilo</h1>
          <p className="text-gray-600 mb-4">Nepodařilo se nám zpracovat vaši objednávku.</p>
          <Link
            href="/contact"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Kontaktujte nás
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Děkujeme za vaši objednávku!</h1>
        <p className="text-gray-600 mb-8">
          Vaše objednávka byla úspěšně přijata a bude brzy zpracována.
          Na váš email jsme vám poslali potvrzení objednávky.
        </p>
        <div className="space-y-4">
          <Link
            href="/orders"
            className="block text-blue-600 hover:text-blue-800 underline"
          >
            Zobrazit moje objednávky
          </Link>
          <Link
            href="/"
            className="block text-gray-600 hover:text-gray-800 underline"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Načítání...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
} 