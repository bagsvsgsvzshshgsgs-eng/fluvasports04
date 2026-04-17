export default function PromoBanner() {
  return (
    <section className="py-20 bg-orange-500 text-gray-50 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-serif mb-6 text-balance text-gold">The Fluva Guarantee</h2>
        <p className="text-lg md:text-xl font-light text-gray-300 mb-10 max-w-2xl mx-auto text-balance">
          Every piece is crafted from premium Italian fabrics, ensuring a perfect fit, UV protection, and timeless style that lasts beyond a single season.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-800 pt-10">
          <div className="flex flex-col items-center">
            <span className="text-white mb-3"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg></span>
            <h3 className="uppercase tracking-widest text-sm font-medium mb-2">Sustainable Materials</h3>
            <p className="text-gray-500 text-sm">Recycled luxury fabrics</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white mb-3"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
            <h3 className="uppercase tracking-widest text-sm font-medium mb-2">Made to Last</h3>
            <p className="text-gray-500 text-sm">Chlorine & sunscreen resistant</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white mb-3"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></span>
            <h3 className="uppercase tracking-widest text-sm font-medium mb-2">Free Returns</h3>
            <p className="text-gray-500 text-sm">Within 30 days of purchase</p>
          </div>
        </div>
      </div>
    </section>
  );
}
