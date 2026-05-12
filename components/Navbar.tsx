"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useStore } from "./StoreContext";
import { useLanguage } from "./LanguageContext";
import SearchOverlay from "./SearchOverlay";
import LanguageSwitcher from "./LanguageSwitcher";
import { ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  isFeatured: boolean;
  parentId: string | null;
  children: Category[];
}

const getNavTranslation = (name: string, t: any) => {
  const map: Record<string, string> = {
    "Women": t("nav_women"),
    "Men": t("nav_men"),
    "Kids": t("nav_kids"),
    "Equipment": t("nav_equipment"),
    "Bundle Deals": t("nav_bundle_deals"),
    "Sale": t("nav_sale"),
    "Contact Us": t("nav_contact_us"),
    "Swimwear & Apparel": t("nav_swimwear_apparel"),
    "Bikinis": t("nav_bikinis"),
    "One Pieces": t("nav_one_pieces"),
  };
  return map[name] || name;
};

function MegaDropdown({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useLanguage();
  const hasChildren = category.children && category.children.length > 0;
  
  const displayName = getNavTranslation(category.name, t);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!hasChildren) {
    return (
      <Link
        href={`/shop?filter=${encodeURIComponent(category.name)}`}
        className={`text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 hover:text-white ${
          category.name.toLowerCase() === "sale" ? "text-red-500 hover:text-red-400" : "text-gray-400"
        }`}
      >
        {displayName}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] font-medium text-gray-400 hover:text-white transition-all duration-300"
        onClick={() => setOpen((o) => !o)}
      >
        {displayName}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-full left-0 mt-3 min-w-[520px] bg-black border border-gray-800 shadow-2xl rounded-xl overflow-hidden z-50 transition-all duration-200 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-900">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              {displayName} — {t("nav_collections")}
            </p>
            <Link
              href={`/shop?filter=${encodeURIComponent(category.name)}`}
              className="text-[10px] uppercase tracking-widest text-orange-500 hover:text-orange-400 font-bold flex items-center gap-1"
              onClick={() => setOpen(false)}
            >
              {t("nav_view_all")} <span className="rtl-flip">→</span>
            </Link>
          </div>

          {/* Sections (L2) */}
          <div className="grid grid-cols-2 gap-6">
            {category.children.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    {getNavTranslation(section.name, t)}
                  </p>
                  {section.isFeatured && (
                    <span className="text-[8px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded uppercase tracking-widest">
                      Featured
                    </span>
                  )}
                </div>

                {/* Sub-categories (L3) */}
                {section.children && section.children.length > 0 ? (
                  <ul className="space-y-2">
                    {section.children.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/shop?filter=${encodeURIComponent(sub.name)}`}
                          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                          onClick={() => setOpen(false)}
                        >
                          <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-orange-500 transition-colors shrink-0" />
                          {getNavTranslation(sub.name, t)}
                          {sub.isFeatured && (
                            <span className="text-[8px] text-orange-400 uppercase tracking-widest">★</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link
                    href={`/shop?filter=${encodeURIComponent(section.name)}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    onClick={() => setOpen(false)}
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-orange-500 transition-colors shrink-0" />
                    {t("nav_shop")} {getNavTranslation(section.name, t)}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navCategories, setNavCategories] = useState<Category[]>([]);
  const { setIsCartOpen, cartCount, settings } = useStore();
  const { t } = useLanguage();
  const siteName = settings.siteName || "FLUVA SPORT";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch category tree for mega-menu
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: Category[]) => setNavCategories(data))
      .catch(() => setNavCategories([]));
  }, []);

  // Fallback static links if no categories in tree yet
  const staticLinks = [
    { name: "Women", href: "/shop?filter=Women" },
    { name: "Men", href: "/shop?filter=Men" },
    { name: "Kids", href: "/shop?filter=Kids" },
    { name: "Equipment", href: "/shop?filter=Equipment" },
    { name: "Bundle Deals", href: "/shop?filter=Bundle+Deals" },
    { name: "Sale", href: "/shop?filter=Sale", className: "text-red-500 hover:text-red-400" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      {settings.maintenanceMode && (
        <div className="bg-red-500 text-white text-center text-xs py-1.5 font-medium tracking-widest uppercase z-[60] relative">
          🔴 Maintenance Mode is Active — Visitors see the maintenance page
        </div>
      )}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-black/95 backdrop-blur-md shadow-lg py-4" : "bg-black py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Dynamic Mega-Menu Nav Links */}
          <div className="hidden lg:flex gap-8 text-xs uppercase tracking-[0.15em] text-gray-400 font-medium items-center">
            {navCategories.length > 0 ? (
              navCategories.map((cat) => (
                <MegaDropdown key={cat.id} category={cat} />
              ))
            ) : (
              staticLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-white transition-all duration-300 ${link.className || ""}`}
                >
                  {getNavTranslation(link.name, t)}
                </Link>
              ))
            )}
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-serif tracking-widest text-white font-bold hover:text-orange-500 transition-colors duration-300"
          >
            {siteName.toUpperCase()}
          </Link>

          {/* Right Icons */}
          <div className="flex gap-4 items-center">
            <LanguageSwitcher />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-orange-500 transition-colors duration-300"
              aria-label="Search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/admin" className="text-white hover:text-orange-500 transition-colors duration-300" aria-label="Admin">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-orange-500 transition-colors duration-300 relative"
              aria-label="Cart"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-orange-500 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
