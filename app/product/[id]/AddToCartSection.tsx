"use client";

import { useState } from "react";
import { useStore } from "@/components/StoreContext";
import { useLanguage } from "@/components/LanguageContext";
import { Product } from "@/lib/data";

export default function AddToCartSection({ product }: { product: Product }) {
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["8", "10", "12", "14", "16", "18"];
  const [selectedColor, setSelectedColor] = useState(product.colorNames[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { t } = useLanguage();
  const isWishlisted = wishlist.includes(product.id);

  const getDynamicPrice = () => {
    if (["8", "10", "12"].includes(selectedSize)) return "EGP 650";
    if (["14", "16", "18"].includes(selectedSize)) return "EGP 700";
    return product.priceStr;
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}_${selectedColor}_${selectedSize}`,
      name: product.name,
      price: getDynamicPrice(),
      image: product.image,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    });
  };

  return (
    <>
      <p className="text-lg text-gray-400 mb-6">{getDynamicPrice()}</p>
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-white">{t("product_color")}: <span className="text-gray-400">{selectedColor}</span></span>
        </div>
        <div className="flex gap-3">
          {product.colorNames.map((colorName, idx) => (
            <button 
              key={idx}
              onClick={() => setSelectedColor(colorName)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedColor === colorName ? 'border-orange-500' : 'border-transparent'} transition-all`}
            >
              <span className={`w-6 h-6 rounded-full block border border-gray-800 ${product.colors[idx]}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-white">{t("product_size")}</span>
          <button className="text-xs text-gray-400 underline underline-offset-2">{t("product_size_guide")}</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-2 flex flex-col items-center justify-center text-sm font-medium border transition-colors ${selectedSize === size ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-800 bg-black text-white hover:border-orange-500'}`}
            >
              <span>{size}</span>
              {["8", "10", "12"].includes(size) && <span className="text-[10px] opacity-80 font-normal">650 EGP</span>}
              {["14", "16", "18"].includes(size) && <span className="text-[10px] opacity-80 font-normal">700 EGP</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-orange-500 text-white py-3 text-xs uppercase tracking-[0.1em] font-medium hover:bg-gray-800 transition-all shadow-md active:scale-95 flex flex-col items-center justify-center gap-0.5 sm:flex-row sm:gap-2 sm:py-4 sm:tracking-[0.2em]"
        >
          <span>{t("product_add_to_bag")}</span>
          <span className="opacity-80 font-normal text-[10px] sm:text-xs">— {getDynamicPrice()}</span>
        </button>
        <button 
          onClick={() => toggleWishlist(product.id)}
          className={`px-5 border border-gray-800 flex items-center justify-center transition-all ${isWishlisted ? 'bg-black text-red-500 border-gray-700' : 'text-gray-500 hover:text-white hover:border-orange-500'}`}
          aria-label="Add to Wishlist"
        >
          <svg width="20" height="20" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>

    </>
  );
}
