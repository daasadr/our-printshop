'use client';

// import { SessionProvider } from 'next-auth/react'; // ODSTRANĚNO
import { CartProvider } from '@/hooks/useCart';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <SessionProvider> // ODSTRANĚNO
      <CartProvider>{children}</CartProvider>
    // </SessionProvider> // ODSTRANĚNO
  );
} 