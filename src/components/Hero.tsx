"use client";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Hero() {
  const { t } = useTranslation("common");
  const [showStory, setShowStory] = useState(false);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
        <Image
          src="/images/tropical-jungle.jpg"
          alt="Hero image"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-2" style={{textShadow: '0 4px 24px #000, 0 1px 2px #000'}}>HappyWilderness</h1>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("welcome")}</h1>
      <p className="text-xl mb-8">{t("subtitle")}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
        <Link
          href="/products"
          className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors border border-gray-300"
        >
          {t("cta_collection")}
        </Link>
        <button
          type="button"
          onClick={() => setShowStory(true)}
          className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
        >
          {t("cta_story")}
        </button>
      </div>

      {/* Modal pre Náš příběh */}
      {showStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full relative overflow-hidden">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold z-10"
              onClick={() => setShowStory(false)}
              aria-label="Zavřít"
            >
              ×
            </button>
            <div className="relative w-full h-56">
              <Image
                src="/images/OIG1.jpeg"
                alt="Náš příběh"
                fill
                className="object-cover object-center rounded-t-lg"
              />
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Náš příběh</h2>
              <p className="text-lg text-gray-700">
                Tvoríme originálne dizajny pre potlač textílií, tričiek a tašiek. Každý kúsok je jedinečný a vzniká s láskou k detailu.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 