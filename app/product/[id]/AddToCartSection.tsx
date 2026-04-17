"use client";

import { useState } from "react";
import { useStore } from "@/components/StoreContext";

import { Product } from "@/lib/data";

export default function AddToCartSection({ product }: { product: Product }) {
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL"];
  const [selectedColor, setSelectedColor] = useState(product.colorNames[0]);
  const [selectedSize, setSelectedSize] = useState(sizes.includes("M") ? "M" : sizes[0]);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}_${selectedColor}_${selectedSize}`,
      name: product.name,
      price: product.priceStr,
      image: product.image,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    });
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-white">Color: <span className="text-gray-400">{selectedColor}</span></span>
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
          <span className="text-sm font-medium text-white">Size</span>
          <button className="text-xs text-gray-400 underline underline-offset-2">Size Guide</button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-3 text-sm font-medium border transition-colors ${selectedSize === size ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-800 bg-black text-white hover:border-orange-500'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-orange-500 text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-gray-800 transition-all shadow-md active:scale-95"
        >
          Add to Bag
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
