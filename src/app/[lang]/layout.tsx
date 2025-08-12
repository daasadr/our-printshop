import { ReactNode } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/main-header';
import { Footer } from '@/components/layout/Footer';

interface LayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

export async function generateStaticParams() {
  return [
    { lang: 'cs' },
    { lang: 'sk' },
    { lang: 'en' },
    { lang: 'de' },
  ];
}

export default async function LocaleLayout({
  children,
  params: { lang },
}: LayoutProps) {
  // Načíst dictionary na server-side
  const dictionary = await getDictionary(lang);

  return (
    <WishlistProvider>
      <div className="min-h-screen bg-gray-50">
        <Header dictionary={dictionary} />
        <main id="main-content" role="main" className="flex-1">
          {children}
        </main>
        <Footer dictionary={dictionary} />
      </div>
    </WishlistProvider>
  );
} 