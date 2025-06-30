'use client';

import { CartProvider } from '@/hooks/useCart';
import CheckoutContent from '@/components/CheckoutContent';

export default function CheckoutWrapper() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
} 