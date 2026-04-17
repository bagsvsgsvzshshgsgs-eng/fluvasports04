"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import FeaturedCategories from "@/components/FeaturedCategories";
import BestSellers from "@/components/BestSellers";
import { useStore } from "@/components/StoreContext";

export default function Home() {
  const { settings } = useStore();

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Banner */}
        <div className="bg-black py-2 text-center text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400 border-b border-gray-800">
          {settings.promoBannerText}
        </div>

        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden bg-gray-900">
          <div className="absolute inset-0 z-0">
            <Image
              src={settings.heroImage}
              alt="Luxury Swimwear"
              fill
              className="object-cover opacity-90 scale-105"
              priority
            />

          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full py-24 md:py-32">
            <div className="max-w-2xl animate-fade-in-up">
              <span className="inline-block mb-6 text-xs uppercase tracking-[0.3em] text-gray-400 font-medium">New 2026 Collection</span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-8 text-balance">
                {settings.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-gray-400 font-light mb-12 max-w-lg leading-relaxed text-balance">
                {settings.heroSubtitle}
              </p>
              <div className="flex gap-4">
                <Link
                  href="/shop"
                  className="bg-orange-500 text-black px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-orange-600 transition-all shadow-xl hover-lift"
                >
                  Shop the Collection
                </Link>
                <Link
                  href="/shop?filter=New"
                  className="border border-white text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all hover-lift"
                >
                  Explore New
                </Link>
              </div>
            </div>
          </div>
        </section>
        <FeaturedCategories />
        <BestSellers />
      </main>
      <Footer />
    </>
  );
}
