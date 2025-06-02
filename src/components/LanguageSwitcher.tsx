"use client";
import { useRouter } from "next/router";
import React from "react";

const LANGUAGES = [
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "sk", label: "Slovenčina", flag: "🇸🇰" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, asPath } = router;

  const handleChange = (lang: string) => {
    if (lang === locale) return;
    router.push(asPath, asPath, { locale: lang });
  };

  return (
    <div className="flex gap-4 items-center justify-center my-4">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          disabled={lang.code === locale}
          className={`
            flex flex-col items-center transition-all duration-200
            ${lang.code === locale 
              ? 'opacity-100 scale-110 font-bold' 
              : 'opacity-70 hover:opacity-100 hover:scale-105'
            }
          `}
          aria-label={lang.label}
        >
          <span className="text-3xl mb-1">{lang.flag}</span>
          <span className="text-sm">{lang.label}</span>
        </button>
      ))}
    </div>
  );
} 