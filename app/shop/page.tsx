"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/components/StoreContext";
import ProductCard from "@/components/ProductCard";

// The core shop content that uses useSearchParams
function ShopContent() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "All";
  
  // Using products from context natively.

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeGroup, setActiveGroup] = useState<string>(initialFilter);
  const [sortOption, setSortOption] = useState<string>("featured");

  const categoryGroups: Record<string, string[]> = {
    "Swimwear & Apparel": [
      "Bikinis", "One Pieces", "Resortwear", "Kaftans", "Cover-Ups", 
      "Sarongs", "Rash Guards", "Swim Shorts", "Kids Swimwear"
    ],
    "Accessories & Gear": [
      "Towels", "Swim Caps", "Sunglasses", "Goggles", "Hats", 
      "Flip Flops", "Beach Bags", "Waterproof Bags"
    ],
    "Pool Lifestyle": [
      "Floaties", "Pool Rings", "Arm Bands", "Sunscreen", 
      "Water Bottles", "Pool Accessories"
    ]
  };

  const allCategories = useMemo(() => {
    let cats: string[] = [];
    Object.values(categoryGroups).forEach(group => {
      cats = [...cats, ...group];
    });
    return cats.sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Top-Level Group
    if (activeGroup !== "All") {
       if (activeGroup === "Swimwear") {
         const swimCats = categoryGroups["Swimwear & Apparel"];
         result = result.filter(p => swimCats.includes(p.category));
       } else if (activeGroup === "Apparel") {
         const apparelCats = ["Resortwear", "Kaftans", "Cover-Ups", "Sarongs"];
         result = result.filter(p => apparelCats.includes(p.category));
       } else if (activeGroup === "Accessories") {
         const accCats = categoryGroups["Accessories & Gear"];
         result = result.filter(p => accCats.includes(p.category));
       } else if (activeGroup === "Lifestyle") {
         const lifeCats = categoryGroups["Pool Lifestyle"];
         result = result.filter(p => lifeCats.includes(p.category));
       }
    }

    // Filter by Specific Category if selected
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Sorting
    if (sortOption === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortOption === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortOption === "newest") result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));

    return result;
  }, [products, activeCategory, activeGroup, sortOption]);

  const handleGroupClick = (group: string) => {
    setActiveGroup(group === activeGroup ? "All" : group);
    setActiveCategory("All"); // Reset sub category when changing groups
  };

  return (
    <main className="min-h-screen bg-black pb-24">
      {/* Editorial Header */}
      <section className="bg-black py-16 px-4 md:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto text-center animate-fade-in-up">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-500 mb-4 block">The Collection</span>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight">Poolside Luxury</h1>
          <p className="text-gray-400 font-light max-w-2xl mx-auto text-balance leading-relaxed">
            Curated pieces for elevated summer living. From impeccably tailored swimwear to lifestyle accessories designed for uncompromising elegance on the Riviera and beyond.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Sticky Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-32 self-start space-y-10">
          
          <div className="space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-gray-800 pb-3">Sort By</h3>
             <div className="space-y-3 pt-2 text-sm text-gray-400">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="sort" checked={sortOption === "featured"} onChange={() => setSortOption("featured")} className="w-3.5 h-3.5 accent-gray-900" />
                  <span className="group-hover:text-white transition-colors">Featured</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="sort" checked={sortOption === "newest"} onChange={() => setSortOption("newest")} className="w-3.5 h-3.5 accent-gray-900" />
                  <span className="group-hover:text-white transition-colors">New Arrivals</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="sort" checked={sortOption === "price-low"} onChange={() => setSortOption("price-low")} className="w-3.5 h-3.5 accent-gray-900" />
                  <span className="group-hover:text-white transition-colors">Price: Low to High</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="sort" checked={sortOption === "price-high"} onChange={() => setSortOption("price-high")} className="w-3.5 h-3.5 accent-gray-900" />
                  <span className="group-hover:text-white transition-colors">Price: High to Low</span>
               </label>
             </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-gray-800 pb-3">Collections</h3>
             {Object.entries(categoryGroups).map(([groupName, categories]) => (
               <div key={groupName} className="space-y-3">
                 <h4 className="text-sm font-medium text-white">{groupName}</h4>
                 <div className="flex flex-col gap-2 pl-2 border-l border-gray-800">
                   {categories.map((cat) => (
                     <button 
                       key={cat} 
                       onClick={() => setActiveCategory(cat === activeCategory ? "All" : cat)}
                       className={`text-left text-xs transition-all ${
                         activeCategory === cat ? "text-white font-medium translate-x-1" : "text-gray-400 hover:text-white"
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 w-full">
           
           {/* Active Filters Bar */}
           <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="text-xs text-gray-500 uppercase tracking-widest">{filteredProducts.length} Items</span>
              {activeGroup !== "All" && (
                <span className="flex items-center gap-2 bg-black border border-gray-800 px-3 py-1.5 text-xs text-gray-400 shadow-sm">
                  Group: {activeGroup}
                  <button onClick={() => setActiveGroup("All")} className="hover:text-white">×</button>
                </span>
              )}
              {activeCategory !== "All" && (
                <span className="flex items-center gap-2 bg-black border border-gray-800 px-3 py-1.5 text-xs text-gray-400 shadow-sm">
                  {activeCategory}
                  <button onClick={() => setActiveCategory("All")} className="hover:text-white">×</button>
                </span>
              )}
              {(activeGroup !== "All" || activeCategory !== "All") && (
                <button onClick={() => { setActiveGroup("All"); setActiveCategory("All"); }} className="text-xs text-gray-500 hover:text-white underline underline-offset-4 pl-2">
                  Clear All
                </button>
              )}
           </div>

           {/* Grid with Interspersed Banners */}
           {filteredProducts.length === 0 ? (
              <div className="py-24 text-center">
                 <p className="text-gray-500 italic">No products match your current filters.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
               {filteredProducts.map((product, index) => {
                 // Insert an editorial banner after the 6th item if we are showing many
                 const showBanner = index === 6; 

                 return (
                   <React.Fragment key={product.id}>
                     {showBanner && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 h-96 relative overflow-hidden my-8 group animate-fade-in-up">
                           <Image 
                             src="/images/category_resortwear_1776341899337.png" 
                             alt="Resortwear Editorial" 
                             fill 
                             className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                           />
                           <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center p-8">
                             <div className="bg-black/95 backdrop-blur-sm p-10 max-w-lg text-center">
                               <h3 className="text-2xl font-serif text-white mb-3">The Riviera Edit</h3>
                               <p className="text-sm text-gray-400 mb-6 font-light">Explore our curated selection of fine silk kaftans and linen sets designed for the ultimate escape.</p>
                               <button 
                                 onClick={() => { setActiveCategory("All"); setActiveGroup("Apparel"); window.scrollTo({ top: 0, behavior: 'smooth'}); }}
                                 className="text-xs uppercase tracking-widest font-bold text-white border-b border-orange-500 pb-1 hover:text-gray-400 transition-colors"
                               >
                                 Shop Apparel
                               </button>
                             </div>
                           </div>
                        </div>
                     )}
                     <ProductCard product={product} index={index} />
                   </React.Fragment>
                 );
               })}
             </div>
           )}

        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-gray-500 text-sm tracking-widest uppercase animate-pulse">
          Loading Collection...
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </>
  );
}
