"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useStore } from "./StoreContext";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { setIsCartOpen, cartCount, setIsWishlistOpen, wishlist } = useStore();



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-black/95 backdrop-blur-md shadow-lg py-4" : "bg-black py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="hidden lg:flex gap-8 text-xs uppercase tracking-[0.15em] text-gray-400 font-medium">
            <Link href="/shop?filter=Women" className="hover:text-white transition-all duration-300">Women</Link>
            <Link href="/shop?filter=Men" className="hover:text-white transition-all duration-300">Men</Link>
            <Link href="/shop?filter=Kids" className="hover:text-white transition-all duration-300">Kids</Link>
            <Link href="/shop?filter=Equipment" className="hover:text-white transition-all duration-300">Equipment</Link>
            <Link href="/shop?filter=Bundle+Deals" className="hover:text-white transition-all duration-300">Bundle Deals</Link>
            <Link href="/shop?filter=Sale" className="text-red-500 hover:text-red-400 transition-all duration-300">Sale</Link>
          </div>

          <Link href="/" className="text-3xl font-serif tracking-widest text-white font-bold hover:text-orange-500 transition-colors duration-300">
            FLUVA SPORT
          </Link>

          <div className="flex gap-6 items-center">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-orange-500 transition-colors duration-300" 
              aria-label="Search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <Link 
              href="/admin"
              className="text-white hover:text-orange-500 transition-colors duration-300" 
              aria-label="Admin"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="text-white hover:text-orange-500 transition-colors duration-300 relative" 
              aria-label="Cart"
            >

              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
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

