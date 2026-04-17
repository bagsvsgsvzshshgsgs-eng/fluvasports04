"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartSection from "./AddToCartSection";
import ReviewSection from "@/components/ReviewSection";
import { useStore } from "@/components/StoreContext";

import { use } from "react";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { products } = useStore();
  const { id } = use(params);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
               {product.images.map((img, idx) => (
                 <div key={idx} className="relative aspect-[3/4] w-full bg-black">
                   <Image src={img} alt={`${product.name} - view ${idx + 1}`} fill className="object-cover" />
                 </div>
               ))}
            </div>

            {/* Product Info */}
            <div className="sticky top-24">
              <h1 className="text-3xl font-serif text-white mb-2">{product.name}</h1>
              <p className="text-lg text-gray-400 mb-6">{product.priceStr}</p>
              
              <div className="prose prose-stone text-gray-400 font-light mb-8">
                 <p>{product.description}</p>
              </div>

              <AddToCartSection product={product} />

              {/* Accordions */}
              <div className="mt-12 border-t border-gray-800 divide-y divide-gray-800">
                 <details className="group py-4">
                    <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-medium text-white uppercase tracking-widest">
                       Details & Care
                       <span className="group-open:rotate-180 transition-transform">↓</span>
                    </summary>
                    <div className="pt-4 text-gray-400 text-sm font-light leading-relaxed">
                       {product.description} Hand wash cold. Do not bleach. Dry flat in shade. Avoid contact with rough surfaces.
                    </div>
                 </details>
                 <details className="group py-4">
                    <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-medium text-white uppercase tracking-widest">
                       Shipping & Returns
                       <span className="group-open:rotate-180 transition-transform">↓</span>
                    </summary>
                    <div className="pt-4 text-gray-400 text-sm font-light leading-relaxed">
                       Free standard shipping on all orders over $300. Returns accepted within 14 days of delivery. All tags must be attached.
                    </div>
                 </details>
              </div>
            </div>
          </div>
        </div>
        
        <ReviewSection productId={product.id} />
      </main>
      <Footer />
    </>
  );
}

