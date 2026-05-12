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
        <section className="relative w-full h-[92vh] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero_professional.png"
              alt="Fluva Sport — Luxury Swimwear Campaign"
              fill
              className="object-cover object-top"
              priority
            />
            {/* Layered gradients for depth and readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-2xl">
              {/* Label */}
              <p className="text-xs uppercase tracking-[0.4em] text-orange-500 font-semibold mb-6">
                New Collection — 2026
              </p>
              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-[1.05] tracking-tight mb-6">
                Elite <br className="hidden md:block"/>Performance.<br/>
                <span className="text-orange-500">Iconic Style.</span>
              </h1>
              {/* Subtitle */}
              <p className="text-base md:text-lg text-gray-300 font-light mb-10 max-w-md leading-relaxed">
                Discover the ultimate fusion of performance engineering and fashion-forward design with our newest elite swimwear collection.
              </p>
              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-xl shadow-orange-900/30 hover:-translate-y-0.5"
                >
                  Shop Now
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
        <FeaturedCategories />
        <BestSellers />
      </main>
      <Footer />
    </>
  );
}
