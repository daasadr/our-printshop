"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LANGUAGES = [
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "sk", label: "Slovenčina", flag: "🇸🇰" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1];

  const handleChange = (lang: string) => {
    const segments = pathname.split("/");
    segments[1] = lang;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", margin: "16px 0" }}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          disabled={lang.code === currentLang}
          style={{
            background: "none",
            border: "none",
            cursor: lang.code === currentLang ? "default" : "pointer",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: lang.code === currentLang ? 1 : 0.7,
            transform: lang.code === currentLang ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.2s, opacity 0.2s",
            fontWeight: lang.code === currentLang ? "bold" : "normal",
            fontSize: 22,
            filter: lang.code === currentLang ? "drop-shadow(0 2px 6px #0002)" : "none",
          }}
          aria-label={lang.label}
        >
          <span style={{ fontSize: 32, marginBottom: 2 }}>{lang.flag}</span>
          <span style={{ fontSize: 13 }}>{lang.label}</span>
        </button>
      ))}
    </div>
  );
} 