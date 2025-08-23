import { ReactNode } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/main-header';
import { Footer } from '@/components/layout/Footer';
import ClientPageTransition from '@/components/ClientPageTransition';
import { FloatingDarkModeToggle } from '@/components/ui/DarkModeToggle';
import FloatingCart from '@/components/FloatingCart';

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
          <ClientPageTransition>
            {children}
          </ClientPageTransition>
        </main>
        <Footer dictionary={dictionary} />
        
        {/* Floating dark mode toggle */}
        <FloatingDarkModeToggle />
        
        {/* Floating cart */}
        <FloatingCart lang={lang} dictionary={dictionary} />
      </div>
    </WishlistProvider>
  );
} 