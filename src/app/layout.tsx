import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

// Nastavení písma
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Our Printshop',
  description: 'Váš oblíbený e-shop s potiskem',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}