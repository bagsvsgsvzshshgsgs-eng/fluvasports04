export default function Testimonials() {
  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-sm uppercase tracking-widest text-gray-400 font-medium mb-12">Words from our Muses</h2>
        <div className="max-w-3xl mx-auto">
          <blockquote className="text-2xl md:text-3xl font-serif text-white leading-relaxed text-balance mb-8">
            "The fit is honestly incomparable. It feels like wearing nothing, yet it sculpts perfectly.
            This is the only swimwear I pack for my travels now."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
             <div className="h-px w-8 bg-gray-700"></div>
             <p className="text-sm uppercase tracking-widest font-medium text-white">Elena V., Verified Buyer</p>
             <div className="h-px w-8 bg-gray-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
