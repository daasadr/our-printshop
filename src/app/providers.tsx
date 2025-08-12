'use client';

import { LocaleProvider } from '@/context/LocaleContext';
import { CartProvider } from '@/hooks/useCart';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <CartProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CartProvider>
    </LocaleProvider>
  );
} 