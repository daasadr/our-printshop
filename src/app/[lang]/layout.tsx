import '../globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '../providers';

// Nastavení písma
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Our Printshop',
  description: 'Váš obľúbený e-shop s potlačou',
};

export default function RootLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 