import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';

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
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}