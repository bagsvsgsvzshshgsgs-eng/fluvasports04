"use client";

import Link from "next/link";
import { useStore } from "./StoreContext";
import ProductCard from "./ProductCard";
import { useLanguage } from "./LanguageContext";


export default function BestSellers() {
  const { products } = useStore();
  const { t } = useLanguage();
  const bestsellers = products.slice(0, 4);

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">{t("most_desired_title")}</h2>
            <p className="text-gray-400 font-light">{t("most_desired_desc")}</p>
          </div>
          <Link href="/shop" className="hidden sm:inline-block text-sm uppercase tracking-widest font-bold border-b-2 border-orange-500 text-white pb-1 hover:text-orange-500 luxury-transition">
            {t("nav_view_all")}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {bestsellers.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>


        
        <div className="mt-12 text-center sm:hidden">
          <Link href="/shop" className="inline-block text-sm uppercase tracking-widest font-bold border-b-2 border-white text-white pb-1 hover:border-orange-500 hover:text-orange-500 transition-colors duration-300">
            {t("view_all_bestsellers")}
          </Link>
        </div>
      </div>
    </section>
  );
}
