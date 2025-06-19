import '../globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '../providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Nastavení písma
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Our Printshop',
  description: 'Váš obľúbený e-shop s potlačou',
};

// Validácia podporovaných jazykov
const validLocales = ['cs', 'sk', 'de', 'en'];

export async function generateStaticParams() {
  return validLocales.map((lang) => ({ lang }));
}

export default function RootLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Kontrola či je jazyk podporovaný
  if (!validLocales.includes(lang)) {
    lang = 'cs'; // Fallback na češtinu
  }

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
} 