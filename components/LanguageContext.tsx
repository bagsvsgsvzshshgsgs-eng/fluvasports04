"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { translations, Locale, TranslationKey } from "@/lib/translations";

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Read locale safely (SSR-safe) — detects browser language on first visit
function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("fluva_locale");
  if (saved === "ar" || saved === "en") return saved;
  // First visit: detect browser language
  const browserLang = navigator.language || "";
  if (browserLang.startsWith("ar")) return "ar";
  return "en";
}

const META: Record<Locale, { title: string; description: string; ogLocale: string }> = {
  en: {
    title: "Fluva Sport — Premium Swimwear & Sportswear",
    description: "Discover premium swimwear and sportswear crafted for performance and style. Shop the latest collections at Fluva Sport.",
    ogLocale: "en_US",
  },
  ar: {
    title: "فلوفا سبورت — ملابس سباحة ورياضة بريميوم",
    description: "اكتشف أرقى ملابس السباحة والرياضة المصممة للأداء والأناقة. تسوق أحدث التشكيلات في فلوفا سبورت.",
    ogLocale: "ar_SA",
  },
};

function applyLocale(l: Locale) {
  const html = document.documentElement;
  html.setAttribute("lang", l);
  html.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
  if (l === "ar") {
    html.classList.add("font-arabic");
    html.classList.remove("font-latin");
  } else {
    html.classList.add("font-latin");
    html.classList.remove("font-arabic");
  }
  // Dynamic SEO meta tags
  const meta = META[l];
  document.title = meta.title;
  let desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!desc) { desc = document.createElement("meta"); desc.name = "description"; document.head.appendChild(desc); }
  desc.content = meta.description;
  let ogLoc = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]');
  if (!ogLoc) { ogLoc = document.createElement("meta"); ogLoc.setAttribute("property", "og:locale"); document.head.appendChild(ogLoc); }
  ogLoc.content = meta.ogLocale;
  let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (!ogTitle) { ogTitle = document.createElement("meta"); ogTitle.setAttribute("property", "og:title"); document.head.appendChild(ogTitle); }
  ogTitle.content = meta.title;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: reads localStorage synchronously on first render (client only)
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  // Sync DOM attributes on mount & whenever locale changes
  useEffect(() => {
    applyLocale(locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem("fluva_locale", l);
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[locale][key] as string,
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t, isRTL: locale === "ar" }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
