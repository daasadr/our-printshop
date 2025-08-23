"use client";

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

interface FooterProps {
  dictionary: any;
}

const Footer: React.FC<FooterProps> = ({ dictionary }) => {
  const { locale } = useLocale();

  // Funkce pro vytvoření jazykového odkazu
  const getLocalizedLink = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <footer role="contentinfo" className="bg-gray-100 pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* O nás */}
          <div>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg className="w-6 h-6 text-gray-600 hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="w-6 h-6 text-gray-600 hover:text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg className="w-6 h-6 text-gray-600 hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Rychlé odkazy */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{dictionary?.footer?.quick_links || "Rychlé odkazy"}</h3>
            <nav className="flex flex-col space-y-2">
              <Link href={getLocalizedLink('/about')} className="text-gray-600 hover:text-blue-600">
                {dictionary?.footer?.about || "O nás"}
              </Link>
              <Link href={getLocalizedLink('/kontakt')} className="text-gray-600 hover:text-blue-600">
                {dictionary?.footer?.contact || "Kontakt"}
              </Link>
              <Link href={getLocalizedLink('/faq')} className="text-gray-600 hover:text-blue-600">
                {dictionary?.faq || "FAQ"}
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                {dictionary?.footer?.terms || "Obchodní podmínky"}
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                {dictionary?.footer?.privacy || "Ochrana soukromí"}
              </Link>
            </nav>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{dictionary?.footer?.about_title || "O nás"}</h3>
            <p className="text-gray-700 mb-4">
              {dictionary?.footer?.brand || "HappyWilderness"}
            </p>
            <p className="text-gray-600 mb-4">
              {dictionary?.footer?.about_text || "Originální oblečení s autorskými potisky."}
            </p>
            <div className="space-y-2 text-gray-600">
              <p>{dictionary?.footer?.email || "Email: happyones@happywilderness.cz"}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>
            {dictionary?.footer?.copyright?.replace('{{year}}', new Date().getFullYear().toString()) || 
             `©${new Date().getFullYear()} AnnLibertas & LuGo všechna práva vyhrazena.`}
          </p>
          <p className="mt-2">
            {dictionary?.footer?.made_in_country || "Vyrobeno s ❤️ Powered by Next.js a Printful."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };