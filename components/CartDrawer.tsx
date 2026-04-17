"use client";

import { useStore } from "./StoreContext";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateCartQuantity } = useStore();

  if (!isCartOpen) return null;

  // Simple cart total calculation (stripping the $ sign from price string)
  const subtotal = cartItems.reduce((acc, item) => {
    const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + (numericPrice * item.quantity);
  }, 0);


  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-orange-500/40 backdrop-blur-sm z-[100] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-black z-[101] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out translate-x-0 border-l border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-black">
          <h2 className="text-lg font-serif text-white">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white transition-colors p-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>


        {/* Items logic */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-gray-300 mb-4"><svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></span>
              <p className="text-gray-400 font-light">Your shopping bag is empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-8 border-b border-orange-500 text-sm uppercase tracking-widest text-white font-medium pb-1"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (

              <div key={item.id} className="flex gap-4">
                <div className="relative aspect-[3/4] w-24 overflow-hidden bg-gray-800 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col pt-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium text-white line-clamp-1 pr-4">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-white">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 uppercase">{item.color} / {item.size}</p>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <div className="flex items-center border border-gray-800">
                      <button 
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-white font-medium">{item.price}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-black border-t border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 font-light tracking-wide">Subtotal</span>
              <span className="text-lg font-medium text-white">${subtotal}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6 font-light">
              Taxes and shipping calculated at checkout.
            </p>
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-orange-500 text-white py-4 text-sm uppercase tracking-widest hover:bg-gray-800 shadow-md luxury-transition text-center hover-lift block"
            >
              Checkout
            </Link>
          </div>
        )}

      </div>
    </>
  );
}

