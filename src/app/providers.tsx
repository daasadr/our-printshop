'use client';

import { LocaleProvider } from '@/context/LocaleContext';
import { CartProvider } from '@/hooks/useCart';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <CartProvider>{children}</CartProvider>
    </LocaleProvider>
  );
} 