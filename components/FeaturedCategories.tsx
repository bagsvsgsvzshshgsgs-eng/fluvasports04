"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "./StoreContext";


export default function FeaturedCategories() {
  const { settings } = useStore();

  const categories = [
    {
      id: 1,
      title: "The One Piece",
      image: settings.categoryImages.onePiece,
      link: "/shop/one-piece",
    },
    {
      id: 2,
      title: "Signature Bikinis",
      image: settings.categoryImages.bikini,
      link: "/shop/bikinis",
    },
    {
      id: 3,
      title: "Resort Cover-Ups",
      image: settings.categoryImages.resort,
      link: "/shop/resort",
    },
  ];

  return (

    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Curated for the Sun</h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">Explore our categories defined by effortless elegance and flawless fits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={category.link} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-900 mb-6 w-full border border-gray-800 hover:border-orange-500 transition-colors duration-300">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-serif text-white tracking-wide group-hover:text-orange-500 transition-colors duration-300">{category.title}</h3>
                <span className="inline-block mt-2 text-sm uppercase tracking-widest text-gray-500 border-b-2 border-transparent group-hover:border-orange-500 group-hover:text-orange-500 transition-all duration-300">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
