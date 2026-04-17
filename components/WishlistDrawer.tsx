"use client";

import { useStore } from "./StoreContext";
import Image from "next/image";
import Link from "next/link";

export default function WishlistDrawer() {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, products, toggleWishlist, addToCart } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-orange-500/40 backdrop-blur-sm z-[110] transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-black z-[111] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out translate-x-0 border-l border-gray-800">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-black sticky top-0 z-10 font-serif">
          <h2 className="text-2xl text-white tracking-wide font-light uppercase">Wishlist</h2>
          <button onClick={() => setIsWishlistOpen(false)} className="text-gray-500 hover:text-white transition-colors p-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500 space-y-4">
              <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <p className="font-light tracking-wide text-sm">Your wishlist is currently empty.</p>
              <Link 
                href="/shop" 
                onClick={() => setIsWishlistOpen(false)}
                className="text-white border-b border-orange-500 pb-0.5 text-xs uppercase tracking-widest font-medium"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div key={product.id} className="flex gap-8 group">
                <div className="relative aspect-[3/4] w-28 overflow-hidden bg-gray-900 shrink-0 shadow-sm">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-white group-hover:text-gray-400 transition-colors uppercase tracking-widest">{product.name}</h3>
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">{product.category}</p>
                  <p className="text-sm font-medium text-white mb-6">{product.priceStr}</p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => {
                        addToCart({
                          id: `${product.id}_wishlist`,
                          name: product.name,
                          price: product.priceStr,
                          image: product.image,
                          quantity: 1,
                          color: product.colorNames[0],
                          size: "M"
                        });
                        setIsWishlistOpen(false);
                      }}
                      className="text-[10px] uppercase tracking-[0.2em] font-medium border-b border-orange-500 pb-1 text-white hover:text-gray-400 hover:border-gray-500 transition-all"
                    >
                      Move to Shopping Bag
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-black border-t border-gray-800 text-[10px] uppercase tracking-[0.25em] text-gray-500 text-center font-light">
          Your saved items will remain here until you remove them.
        </div>
      </div>
    </>
  );
}
