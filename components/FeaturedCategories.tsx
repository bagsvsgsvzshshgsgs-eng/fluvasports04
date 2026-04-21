"use client";

import Image from "next/image";
import Link from "next/link";

type Category = {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  image: string | null;
  gradient: string;
  accentColor: string;
  span?: "wide" | "tall" | "normal";
  objectPosition?: string;
};

const CATEGORIES: Category[] = [
  {
    id: "women",
    label: "Women",
    sublabel: "Competition & Style",
    href: "/shop?filter=Women",
    image: "/images/category_bikini_1776081526337.png",
    gradient: "from-rose-900 via-pink-800 to-fuchsia-900",
    accentColor: "#f472b6",
    span: "tall",
    objectPosition: "center top",
  },
  {
    id: "men",
    label: "Men",
    sublabel: "Performance Jammers",
    href: "/shop?filter=Men",
    image: "/images/cat_men.png",
    gradient: "from-slate-900 via-blue-900 to-indigo-900",
    accentColor: "#60a5fa",
    span: "normal",
  },
  {
    id: "kids",
    label: "Kids",
    sublabel: "Fun & Colourful",
    href: "/shop?filter=Kids",
    image: "/images/cat_kids.png",
    gradient: "from-sky-700 via-cyan-600 to-teal-700",
    accentColor: "#34d399",
    span: "normal",
  },
  {
    id: "equipment",
    label: "Equipment",
    sublabel: "Pro Training Gear",
    href: "/shop?filter=Equipment",
    image: "/images/cat_equipment.png",
    gradient: "from-zinc-800 via-neutral-700 to-stone-800",
    accentColor: "#e2e8f0",
    span: "wide",
  },
  {
    id: "bundle",
    label: "Bundle Deals",
    sublabel: "Save More Together",
    href: "/shop?filter=Bundle+Deals",
    image: "/images/cat_bundle.png",
    gradient: "from-amber-900 via-orange-800 to-yellow-900",
    accentColor: "#fb923c",
    span: "normal",
  },
  {
    id: "sale",
    label: "Sale",
    sublabel: "Up to 50% Off",
    href: "/shop?filter=Sale",
    image: "/images/category_one_piece_1776081471457.png",
    gradient: "from-red-900 via-rose-800 to-orange-900",
    accentColor: "#f87171",
    span: "normal",
    objectPosition: "center center",
  },
  {
    id: "planet-water",
    label: "Planet Water",
    sublabel: "Sustainable by Design",
    href: "/shop?filter=Planet+Water",
    image: null, // quota failed — using gradient
    gradient: "from-teal-900 via-emerald-800 to-cyan-900",
    accentColor: "#2dd4bf",
    span: "wide",
  },
];

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={cat.href}
      className="group relative overflow-hidden block rounded-none bg-black"
      style={{ minHeight: cat.span === "tall" ? "560px" : "280px" }}
    >
      {/* Background Image or Gradient */}
      {cat.image ? (
        <Image
          src={cat.image}
          alt={cat.label}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ objectPosition: cat.objectPosition ?? "center center" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5" />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{ backgroundColor: cat.accentColor }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-7 flex flex-col gap-1">
        <p
          className="text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-300"
          style={{ color: cat.accentColor }}
        >
          {cat.sublabel}
        </p>
        <h3 className="text-white font-bold text-3xl md:text-4xl uppercase tracking-tight leading-none">
          {cat.label}
        </h3>

        {/* Arrow CTA — slides in on hover */}
        <div className="flex items-center gap-2 mt-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white">
            Shop Now
          </span>
          <svg
            width="20"
            height="10"
            viewBox="0 0 20 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 5H18M14 1L18 5L14 9"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Sale badge */}
      {cat.id === "sale" && (
        <div className="absolute top-5 right-5 flex flex-col items-end gap-1">
          <span className="px-4 py-1.5 text-[11px] uppercase tracking-widest font-extrabold text-white rounded-full bg-red-600 shadow-lg shadow-red-900/60">
            Up to 50% Off
          </span>
          <span className="px-3 py-1 text-[9px] uppercase tracking-widest font-semibold text-red-200 bg-black/60 rounded-full backdrop-blur-sm">
            Limited Time
          </span>
        </div>
      )}

      {/* Planet Water eco badge */}
      {cat.id === "planet-water" && (
        <div className="absolute top-5 right-5 px-3 py-1 border text-[10px] uppercase tracking-widest font-semibold rounded-full"
          style={{ borderColor: cat.accentColor, color: cat.accentColor }}
        >
          🌊 Eco Collection
        </div>
      )}
    </Link>
  );
}

export default function FeaturedCategories() {
  const women = CATEGORIES.find((c) => c.id === "women")!;
  const rest = CATEGORIES.filter((c) => c.id !== "women");

  // rows: row1 = [men, kids], row2 = [equipment (wide)], row3 = [bundle, sale], row4 = [planet-water (wide)]
  const men = rest.find((c) => c.id === "men")!;
  const kids = rest.find((c) => c.id === "kids")!;
  const equipment = rest.find((c) => c.id === "equipment")!;
  const bundle = rest.find((c) => c.id === "bundle")!;
  const sale = rest.find((c) => c.id === "sale")!;
  const planetWater = rest.find((c) => c.id === "planet-water")!;

  return (
    <section className="bg-black py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-3 font-medium">
            Shop by Category
          </p>
          <h2 className="font-bold text-4xl md:text-6xl text-white leading-none uppercase tracking-tight mb-4">
            Find Your Sport
          </h2>
          <p className="text-gray-400 font-light max-w-lg mx-auto text-base leading-relaxed">
            Performance gear and fashion-forward designs, crafted for every swimmer.
          </p>
        </div>

        {/* --- GRID --- */}
        {/* Row 1: Women (tall, left) + Men + Kids stacked (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-1">
          {/* Women — tall */}
          <div className="md:row-span-2">
            <CategoryCard cat={women} />
          </div>

          {/* Men */}
          <div style={{ minHeight: "280px" }}>
            <CategoryCard cat={men} />
          </div>

          {/* Kids */}
          <div style={{ minHeight: "280px" }}>
            <CategoryCard cat={kids} />
          </div>
        </div>

        {/* Row 2: Equipment — full width */}
        <div className="mb-1" style={{ minHeight: "340px" }}>
          <CategoryCard cat={equipment} />
        </div>

        {/* Row 3: Bundle + Sale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-1">
          <div style={{ minHeight: "320px" }}>
            <CategoryCard cat={bundle} />
          </div>
          <div style={{ minHeight: "320px" }}>
            <CategoryCard cat={sale} />
          </div>
        </div>

        {/* Row 4: Planet Water — full width */}
        <div style={{ minHeight: "360px" }}>
          <CategoryCard cat={planetWater} />
        </div>

      </div>
    </section>
  );
}
