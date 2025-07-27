import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

const Logo: React.FC = () => {
  const { locale } = useLocale();
  
  return (
    <Link href={`/${locale}`} className="flex-shrink-0">
      <div className="h-8 md:h-10 w-auto relative">
        {/* Zde by bylo vaše logo */}
        <div className="font-bold text-lg md:text-xl text-gray-900 hover:text-blue-600 transition-colors">
          HappyWilderness
        </div>
      </div>
    </Link>
  );
};

export { Logo }; 