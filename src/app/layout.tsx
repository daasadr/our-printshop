import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/main-header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

// Add skip navigation styles
const skipLinkStyles = `
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    border-radius: 0 0 4px 4px;
    z-index: 50;
    transition: top 0.3s;
  }
  
  .skip-link:focus {
    top: 0;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Nastavení písma
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HappyWilderness',
  description: 'Originální oblečení s autorskými potisky',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <style dangerouslySetInnerHTML={{ __html: skipLinkStyles }} />
      </head>
      <body className={inter.className}>
        {/* Skip Navigation */}
        <a href="#main-content" className="skip-link">
          Přeskočit na hlavní obsah
        </a>
        
        <Providers>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main id="main-content" role="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}