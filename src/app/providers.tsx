'use client';

import { LocaleProvider } from '@/context/LocaleContext';
import { CartProvider } from '@/hooks/useCart';
import { ToastProvider } from '@/components/ui/Toast';
import { DarkModeProvider } from '@/context/DarkModeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <LocaleProvider>
        <CartProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CartProvider>
      </LocaleProvider>
    </DarkModeProvider>
  );
} 