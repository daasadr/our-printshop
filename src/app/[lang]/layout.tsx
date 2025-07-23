import { ReactNode } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { LocaleProvider } from '@/context/LocaleContext';
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
  return (
    <LocaleProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main id="main-content" role="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
} 