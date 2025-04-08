import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Header} from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/hooks/useCart';
import './globals.css';

// Nastavení písma
const inter = Inter({ subsets: ['latin', 'latin-ext'] });

// Metadata stránky
export const metadata: Metadata = {
  title: {
    default: 'Wild Shop | Originální oblečení s autorskými potisky',
    template: '%s | Wild Shop'
  },
  description: 'Objevte unikátní kolekci oblečení s autorskými potisky. Každý kus je vyroben na míru podle vašich požadavků.',
  keywords: ['autorské potisky', 'originální oblečení', 'print on demand', 'český design', 'trička s potiskem'],
  authors: [{ name: 'Vaše Jméno' }],
  creator: 'Vaše Jméno',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://www.vasbrand.cz',
    siteName: 'Wild Shop',
    title: 'Wild Shop | Originální oblečení s autorskými potisky',
    description: 'Objevte unikátní kolekci oblečení s autorskými potisky. Každý kus je vyroben na míru podle vašich požadavků.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wild Shop - Originální oblečení s autorskými potisky'
      }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}