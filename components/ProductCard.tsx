"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "./StoreContext";
import { useLanguage } from "./LanguageContext";

type Product = {
  id: string;
  name: string;
  category: string;
  priceStr: string;
  image: string;
  colors: string[];
  isNew?: boolean;
};

export default function ProductCard({ product, index }: { product: Product, index?: number }) {
  const { toggleWishlist, wishlist } = useStore();
  const { t, isRTL } = useLanguage();
  const isWishlisted = wishlist.includes(product.id);

  const staggerClass = index !== undefined ? `stagger-${(index % 4) + 1}` : "";

  return (
    <div className={`group relative block animate-fade-in-up ${staggerClass}`}>

      {/* Product Image & Overlays */}
      <div className="w-full mb-6">
        {product.isNew && (
          <span className="absolute top-4 start-4 z-10 bg-orange-500 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-black shadow-lg">
            {t("shop_new_arrival")}
          </span>
        )}
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-4 end-4 z-10 p-2.5 rounded-full transition-all duration-300 backdrop-blur-sm ${
            isWishlisted 
            ? "bg-orange-500 text-black shadow-lg" 
            : "bg-black/10 text-white hover:bg-orange-500 hover:text-black hover:shadow-lg"
          }`}
        >
          <svg width="18" height="18" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>

        <Link 
          href={`/product/${product.id}`} 
          className="relative block aspect-[3/4] w-full overflow-hidden bg-black" 
          style={{ position: 'relative' }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </Link>
        
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Link 
            href={`/product/${product.id}`}
            className="w-full bg-orange-500 text-black py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-orange-400 shadow-lg flex items-center justify-center transition-colors duration-300"
          >
            {t("shop_view_details")}
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <Link href={`/product/${product.id}`} className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0" style={{ direction: 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
          <h3 className="text-sm font-medium text-white mb-2 line-clamp-1 uppercase tracking-widest" title={product.name}>{product.name}</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">{product.category}</p>
          <div className="flex gap-1.5" style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
            {product.colors.map((color, idx) => (
              <div key={idx} className={`w-3 h-3 rounded-full border-2 border-gray-400 ${color}`} />
            ))}
          </div>
        </div>
        <span className="text-sm text-white font-bold whitespace-nowrap shrink-0 pt-0.5" style={{ direction: 'ltr' }}>{product.priceStr}</span>
      </Link>
    </div>
  );
}
