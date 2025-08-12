'use client';

import { LocaleProvider } from '@/context/LocaleContext';
import { CartProvider } from '@/hooks/useCart';
import { ToastProvider } from '@/components/ui/Toast';
import { TransitionProvider } from '@/context/TransitionContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <CartProvider>
        <ToastProvider>
          <TransitionProvider>
            {children}
          </TransitionProvider>
        </ToastProvider>
      </CartProvider>
    </LocaleProvider>
  );
} 