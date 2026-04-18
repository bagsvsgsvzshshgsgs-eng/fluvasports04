"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "./StoreContext";
import { allProducts } from "@/lib/data";

function CategoryCollection({
  config,
  index,
  storeProducts,
}: {
  config: {
    id: string;
    title: string;
    subtitle: string;
    link: string;
    accentColor: string;
    productIds: string[];
  };
  index: number;
  storeProducts: ReturnType<typeof useStore>["products"];
}) {
  // Resolve products from live store or fall back to static data
  const resolveProduct = (id: string) =>
    storeProducts.find((p) => p.id === id) ??
    allProducts.find((p) => p.id === id);

  const products = config.productIds
    .map(resolveProduct)
    .filter(Boolean) as NonNullable<ReturnType<typeof resolveProduct>>[];

  const [heroProduct, ...gridProducts] = products;

  const isReversed = index % 2 === 1;

  return (
    <div className="border-t border-gray-800 py-20 first:border-t-0">
      {/* Category Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p
            className="text-xs uppercase tracking-[0.35em] mb-3 font-medium"
            style={{ color: config.accentColor }}
          >
            {config.subtitle}
          </p>
          <h3 className="font-serif text-4xl md:text-5xl text-white leading-none">
            {config.title}
          </h3>
        </div>
        <Link
          href={config.link}
          className="hidden sm:flex items-center gap-3 group text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300 font-medium pb-1"
        >
          Shop All
          <span
            className="block w-8 h-px transition-all duration-500 group-hover:w-14"
            style={{ backgroundColor: config.accentColor }}
          />
        </Link>
      </div>

      {/* Product Grid: hero + 2×2 smaller items */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 md:gap-6 ${
          isReversed ? "lg:grid-flow-dense" : ""
        }`}
      >
        {/* Hero Product — spans 2 rows */}
        {heroProduct && (
          <Link
            href={`/product/${heroProduct.id}`}
            className="group relative block bg-zinc-950 overflow-hidden lg:row-span-2"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "3/4", position: "relative" }}
            >
              <Image
                src={heroProduct.image}
                alt={heroProduct.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {heroProduct.isNew && (
                  <span
                    className="inline-block mb-3 px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold text-black"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    New Arrival
                  </span>
                )}
                <h4 className="text-white font-serif text-xl md:text-2xl leading-tight mb-1">
                  {heroProduct.name}
                </h4>
                <p className="text-gray-300 text-sm font-light">
                  {heroProduct.priceStr}
                </p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5" />
            </div>
          </Link>
        )}

        {/* Secondary products — 2×2 */}
        <div
          className={`grid grid-cols-2 gap-4 md:gap-6 ${
            isReversed ? "lg:col-start-1 lg:row-start-1" : ""
          }`}
        >
          {gridProducts.slice(0, 4).map((product) => {
            if (!product) return null;
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative block bg-zinc-950 overflow-hidden"
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "3/4", position: "relative" }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span
                      className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-black shadow-xl backdrop-blur-sm"
                      style={{ backgroundColor: config.accentColor }}
                    >
                      View
                    </span>
                  </div>
                </div>
                <div className="pt-3 pb-1 px-0.5">
                  <h4 className="text-white text-xs font-medium uppercase tracking-widest leading-tight line-clamp-1 group-hover:text-gray-300 transition-colors duration-300">
                    {product.name}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1 font-light">
                    {product.priceStr}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 sm:hidden">
        <Link
          href={config.link}
          className="inline-flex items-center gap-3 text-xs uppercase tracking-widest font-medium border-b pb-1 transition-colors duration-300"
          style={{ borderColor: config.accentColor, color: config.accentColor }}
        >
          Shop {config.title}
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedCategories() {
  const { settings, products } = useStore();

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-4 font-medium">
            The Collection
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-white leading-none mb-5">
            Curated for the Sun
          </h2>
          <p className="text-gray-400 font-light max-w-xl mx-auto text-base leading-relaxed">
            Three stories of effortless elegance — each a world unto itself.
          </p>
        </div>

        {/* Category collections stacked vertically */}
        <div>
          {settings.categoryShowcase.map((config, i) => (
            <CategoryCollection
              key={config.id}
              config={config}
              index={i}
              storeProducts={products}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
