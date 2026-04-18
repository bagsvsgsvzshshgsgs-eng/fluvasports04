"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/components/StoreContext";
import { notFound, useParams } from "next/navigation";
import { use } from "react";
import ProductCard from "@/components/ProductCard";


export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { products } = useStore();
  const { category } = use(params);


  let productCategory = "";
  let pageTitle = "";
  if (category === "bikinis" || category === "bikini") {
    productCategory = "Bikinis";
    pageTitle = "Bikinis";
  } else if (category === "one-piece") {
    productCategory = "One Pieces";
    pageTitle = "One Pieces";
  } else if (category === "resort") {
    productCategory = "Resortwear";
    pageTitle = "Resort Wear";
  } else {
    notFound();
  }

  const categoryProducts = products.filter(p => p.category === productCategory);


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pb-24">
        {/* Header */}
        <section className="bg-black py-16 px-4 md:px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{pageTitle}</h1>
            <p className="text-gray-400 font-light max-w-xl mx-auto text-balance">
              Discover our signature {pageTitle.toLowerCase()}. Each garment is beautifully tailored to provide an impeccable fit and lasting luxury.
            </p>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
            <div className="flex gap-6 text-sm uppercase tracking-widest text-gray-400 font-medium">
              <Link href="/shop" className="cursor-pointer hover:text-white transition-colors">All</Link>
              <Link href="/shop/bikinis" className={category === "bikinis" ? "text-white border-b border-orange-500 pb-1" : "cursor-pointer hover:text-white transition-colors"}>Bikinis</Link>
              <Link href="/shop/one-piece" className={category === "one-piece" ? "text-white border-b border-orange-500 pb-1" : "cursor-pointer hover:text-white transition-colors"}>One Pieces</Link>
              <Link href="/shop/resort" className={category === "resort" ? "text-white border-b border-orange-500 pb-1" : "cursor-pointer hover:text-white transition-colors"}>Resort</Link>

            </div>
            <div className="text-sm tracking-widest text-gray-400 font-medium cursor-pointer flex items-center gap-2">
              Sort By
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {categoryProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                No products found in this category.
              </div>
            ) : (
              categoryProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))

            )}

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
