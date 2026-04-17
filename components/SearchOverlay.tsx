"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "./StoreContext";

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(products.slice(0, 4));

  useEffect(() => {
    if (query.trim() === "") {
      setResults(products.slice(0, 4));
    } else {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query, products]);


  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-orange-500/40 backdrop-blur-sm z-[110] transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-black z-[111] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out translate-x-0 border-l border-gray-800">
        
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-black sticky top-0 z-10">
          <div className="flex-1 mr-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-2xl font-serif text-white placeholder:text-gray-200 focus:outline-none"
            />
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-10 text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
            {query.trim() === "" ? "Trending Products" : `Results Found (${results.length})`}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {results.length === 0 ? (
              <p className="text-gray-400 font-light italic">No products found for "{query}"</p>
            ) : (
              results.map((product) => (
                <Link 
                  href={`/product/${product.id}`} 
                  key={product.id} 
                  onClick={onClose}
                  className="group flex gap-6 items-center"
                >
                  <div className="relative aspect-[3/4] w-24 bg-black overflow-hidden shrink-0">
                    <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white group-hover:text-gray-400 transition-colors mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>
                    <span className="text-sm text-white font-medium">{product.priceStr}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="p-8 bg-black border-t border-gray-800 italic text-xs text-gray-500">
          Hit Enter to see all results for "{query || '...'}"
        </div>
      </div>
    </>
  );
}
