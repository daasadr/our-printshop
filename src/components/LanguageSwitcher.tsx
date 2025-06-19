import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";

const LANGUAGES = [
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "sk", label: "Slovenčina", flag: "🇸🇰" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  
  // Get current language from router
  const currentLang = router.locale || "cs";

  const handleChange = (lang: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: lang });
  };

  return (
    <div className="flex gap-4 items-center justify-center my-4">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          disabled={lang.code === currentLang}
          className={`
            flex flex-col items-center
            bg-transparent border-none outline-none
            ${lang.code === currentLang ? 'cursor-default opacity-100 scale-115' : 'cursor-pointer opacity-70 hover:opacity-100'}
            transition-all duration-200
            font-${lang.code === currentLang ? 'bold' : 'normal'}
            text-lg
            ${lang.code === currentLang ? 'filter drop-shadow-md' : ''}
          `}
          aria-label={lang.label}
        >
          <span className="text-3xl mb-0.5">{lang.flag}</span>
          <span className="text-sm">{lang.label}</span>
        </button>
      ))}
    </div>
  );
} 