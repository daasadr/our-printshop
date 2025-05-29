import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';
import { CartProvider } from '@/hooks/useCart';
import { SessionProvider } from 'next-auth/react';

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(App); 