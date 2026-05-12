"use client";

import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <button
      onClick={() => setLocale(isAr ? "en" : "ar")}
      aria-label="Switch language"
      title={isAr ? "Switch to English" : "التبديل إلى العربية"}
      className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-700 hover:border-orange-500 transition-all duration-300 text-gray-400 hover:text-white"
    >
      {/* Sliding pill indicator */}
      <span
        className={`absolute inset-0 rounded-full bg-orange-500/10 transition-opacity duration-300 opacity-0 group-hover:opacity-100`}
      />

      {/* EN label */}
      <span
        className={`text-[10px] uppercase tracking-widest font-bold transition-all duration-300 relative z-10 ${
          !isAr ? "text-orange-500" : "text-gray-600"
        }`}
      >
        EN
      </span>

      {/* Toggle track */}
      <span className="relative w-8 h-4 flex items-center bg-gray-800 rounded-full border border-gray-700 shrink-0">
        <span
          className={`absolute w-3 h-3 rounded-full bg-orange-500 shadow transition-all duration-300 ease-in-out ${
            isAr ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>

      {/* AR label */}
      <span
        className={`text-[10px] uppercase tracking-widest font-bold transition-all duration-300 relative z-10 ${
          isAr ? "text-orange-500" : "text-gray-600"
        }`}
      >
        AR
      </span>
    </button>
  );
}
