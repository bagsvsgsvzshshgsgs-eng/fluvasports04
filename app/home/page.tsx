"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import FeaturedCategories from "@/components/FeaturedCategories";
import BestSellers from "@/components/BestSellers";
export default function Home() {

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>

        {/* Hero Section */}
        <section className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-video lg:aspect-[21/9] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/swimwear_hero_clean.png"
              alt="Luxury Swimwear Campaign"
              fill
              className="object-cover object-[center_15%]"
              priority
            />
            {/* Gradient overlay for better text readability on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="max-w-xl animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-[72px] font-sans text-white font-bold leading-[1.05] tracking-tight uppercase mb-6">
                NEW WATER &<br />SHOCKING PINK<br />LIMITED EDITIONS
              </h1>
              <p className="text-lg md:text-xl text-gray-200 font-light mb-10 max-w-md leading-relaxed">
                Discover the ultimate performance and style with our newest elite swimwear collection.
              </p>
              <div>
                <Link
                  href="/shop"
                  className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-blue-700 transition-all shadow-xl hover:-translate-y-1 hover:shadow-blue-900/50"
                >
                  Discover now
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
