"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/components/StoreContext";

export default function SuccessPage() {
  const { orders } = useStore();
  const recentOrderId = orders.length > 0 ? orders[0].id : "FLV-82937-2910";

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center bg-black px-4">
        <div className="max-w-2xl w-full text-center py-20">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-black">
              <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight">Order Confirmed</h1>
          <p className="text-gray-400 text-lg mb-10 font-light leading-relaxed">
            Thank you for your purchase. We've sent a confirmation email to your inbox and will notify you as soon as your order ships.
          </p>
          
          <div className="space-y-4">
            <div className="p-6 bg-gray-900 border border-gray-800 mb-8 inline-block w-full">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Order Number</p>
              <p className="text-xl font-medium text-white">#{recentOrderId.replace(/^#/, '')}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/shop" 
                className="bg-orange-500 text-black px-10 py-4 text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg font-bold"
              >
                Continue Shopping
              </Link>
              <Link 
                href="/account" 
                className="border border-orange-500 text-orange-500 px-10 py-4 text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-black transition-all font-bold"
              >
                Track My Order
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
