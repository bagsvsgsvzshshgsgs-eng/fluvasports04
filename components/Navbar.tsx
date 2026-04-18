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
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-gray-400 font-medium">
            <Link href="/shop?filter=Swimwear" className="hover:text-orange-500 transition-all duration-300 hover:tracking-wider">Swimwear</Link>
            <Link href="/shop?filter=Apparel" className="hover:text-orange-500 transition-all duration-300 hover:tracking-wider">Apparel</Link>
            <Link href="/shop?filter=Accessories" className="hover:text-orange-500 transition-all duration-300 hover:tracking-wider">Accessories</Link>
            <Link href="/shop?filter=Lifestyle" className="hover:text-orange-500 transition-all duration-300 hover:tracking-wider">Pool Lifestyle</Link>
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
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="text-white hover:text-orange-500 transition-colors duration-300 relative" 
              aria-label="Wishlist"
            >
              <svg width="20" height="20" fill={wishlist.length > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-black text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
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

