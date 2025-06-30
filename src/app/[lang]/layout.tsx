'use client';
import '../globals.css';
import { Inter } from 'next/font/google';
import { dir } from 'i18next';
import { languages } from '../i18n/settings';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

console.log('Layout component loading...');

// Nastavení písma
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Our Printshop',
  description: 'Váš obľúbený e-shop s potlačou',
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lang: lng }));
}

export default function RootLayout({
  children,
  params: {
    lang
  }
}: {
  children: React.ReactNode,
  params: {
    lang: string
  }
}) {
  console.log('Layout render function called, lang:', lang);
  
  return (
    <html lang={lang} dir={dir(lang)}>
      <body className={inter.className}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 