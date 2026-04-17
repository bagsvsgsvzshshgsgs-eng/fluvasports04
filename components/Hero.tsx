import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fluva-hero.jpeg"
          alt="Fluva Sport Collection"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl pt-16">
        <span className="block text-orange-500 uppercase tracking-[0.3em] text-sm font-semibold mb-6 drop-shadow-lg animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          The 2026 Resort Collection
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 text-balance drop-shadow-xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Elegance by the Water
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mb-12 font-light max-w-2xl mx-auto drop-shadow-lg text-balance animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          Discover our new signature line of sustainable, impeccably tailored swimwear designed for the modern muse.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Link
            href="#shop"
            className="bg-orange-500 text-black px-8 py-4 tracking-widest uppercase text-sm font-bold hover:bg-orange-400 transition-all duration-300 luxury-transition hover-lift shadow-lg"
          >
            Shop the Collection
          </Link>
          <Link
            href="#about"
            className="border-2 border-orange-500 text-orange-500 px-8 py-4 tracking-widest uppercase text-sm font-bold hover:bg-orange-500 hover:text-black transition-all duration-300 luxury-transition hover-lift"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
