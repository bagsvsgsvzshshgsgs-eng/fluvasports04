import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-gray-800 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        <div className="md:col-span-1">
          <Link href="/" className="text-2xl font-serif tracking-widest text-orange-500 font-bold block mb-6 hover:text-orange-400 transition-colors duration-300">
            FLUVA SPORT
          </Link>
          <p className="text-gray-400 font-light max-w-xs text-balance mb-8">
            Elevating the resort wardrobe with sustainable, modern luxury for the worldly traveler.
          </p>
          <div className="space-y-3">
            <Link href="/contact" className="flex items-start gap-3 text-gray-400 hover:text-orange-500 transition-colors duration-300 group">
              <svg className="w-5 h-5 mt-0.5 text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <div>
                <span className="block font-medium text-white text-xs tracking-widest uppercase mb-1">Store Location</span>
                <span className="font-light text-sm">El Bashayer</span>
              </div>
            </Link>
            <Link href="/contact" className="flex items-start gap-3 text-gray-400 hover:text-orange-500 transition-colors duration-300 group pt-2">
              <svg className="w-5 h-5 mt-0.5 text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div>
                <span className="block font-medium text-white text-xs tracking-widest uppercase mb-1">Contact Us</span>
                <span className="font-light text-sm">hello@fluvasport.com<br/>+1 (555) 123-4567</span>
              </div>
            </Link>
          </div>
        </div>

        <div>
          <h4 className="uppercase tracking-widest text-white font-bold mb-6">Shop</h4>
          <ul className="space-y-4 text-gray-400 font-light">
            <li><Link href="#shop" className="hover:text-orange-500 transition-colors duration-300">All Swimwear</Link></li>
            <li><Link href="#shop" className="hover:text-orange-500 transition-colors duration-300">One Pieces</Link></li>
            <li><Link href="#shop" className="hover:text-orange-500 transition-colors duration-300">Bikinis</Link></li>
            <li><Link href="#shop" className="hover:text-orange-500 transition-colors duration-300">Resort Wear</Link></li>
            <li><Link href="#shop" className="hover:text-orange-500 transition-colors duration-300">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="uppercase tracking-widest text-white font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-gray-400 font-light">
            <li><Link href="#faq" className="hover:text-orange-500 transition-colors duration-300">FAQ</Link></li>
            <li><Link href="#shipping" className="hover:text-orange-500 transition-colors duration-300">Shipping & Returns</Link></li>
            <li><Link href="#size" className="hover:text-orange-500 transition-colors duration-300">Size Guide</Link></li>
          </ul>
        </div>


        <div>
          <h4 className="uppercase tracking-widest text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-gray-400 font-light">
            <li><Link href="#terms" className="hover:text-orange-500 transition-colors duration-300">Terms of Service</Link></li>
            <li><Link href="#privacy" className="hover:text-orange-500 transition-colors duration-300">Privacy Policy</Link></li>
            <li><Link href="#cookie" className="hover:text-orange-500 transition-colors duration-300">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8 mt-8">
        <p className="text-gray-600 font-light mb-4 md:mb-0">
          © {new Date().getFullYear()} Fluva Sport. All rights reserved.
        </p>
        <div className="flex gap-6 text-gray-600">
          <Link href="#instagram" className="hover:text-orange-500 transition-colors duration-300 font-light">Instagram</Link>
          <Link href="#pinterest" className="hover:text-orange-500 transition-colors duration-300 font-light">Pinterest</Link>
          <Link href="#tiktok" className="hover:text-orange-500 transition-colors duration-300 font-light">TikTok</Link>
        </div>
      </div>
    </footer>
  );
}
