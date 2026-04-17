import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-gray-800 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        <div className="md:col-span-1">
          <Link href="/" className="text-2xl font-serif tracking-widest text-orange-500 font-bold block mb-6 hover:text-orange-400 transition-colors duration-300">
            FLUVA SPORT
          </Link>
          <p className="text-gray-400 font-light max-w-xs text-balance">
            Elevating the resort wardrobe with sustainable, modern luxury for the worldly traveler.
          </p>
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
            <li><Link href="/admin" className="hover:text-orange-500 transition-colors duration-300 font-medium">Admin Portal</Link></li>
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
