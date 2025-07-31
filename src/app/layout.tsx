import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';

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
  title: 'HappyWilderness - Originální oblečení s autorskými potisky',
  description: 'Objevte naši kolekci originálního oblečení s autorskými potisky. Trička, mikiny, plakáty a další produkty s jedinečnými designy.',
  keywords: 'oblečení, trička, mikiny, plakáty, autorské potisky, design, fashion',
  authors: [{ name: 'HappyWilderness' }],
  creator: 'HappyWilderness',
  publisher: 'HappyWilderness',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://happywilderness.cz'),
  openGraph: {
    title: 'HappyWilderness - Originální oblečení s autorskými potisky',
    description: 'Objevte naši kolekci originálního oblečení s autorskými potisky. Trička, mikiny, plakáty a další produkty s jedinečnými designy.',
    url: 'https://happywilderness.cz',
    siteName: 'HappyWilderness',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HappyWilderness - Originální oblečení',
      },
    ],
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HappyWilderness - Originální oblečení s autorskými potisky',
    description: 'Objevte naši kolekci originálního oblečení s autorskými potisky.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
        
        <AuthProvider>
          <Providers>
            <CartProvider>
              <WishlistProvider>
                {children}
              </WishlistProvider>
            </CartProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}