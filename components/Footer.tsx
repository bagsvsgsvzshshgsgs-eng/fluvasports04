"use client";

import Link from "next/link";
import { useStore } from "./StoreContext";
import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { settings } = useStore();
  const { t } = useLanguage();

  const instagram = settings.socialLinks?.instagram || "#";
  const facebook  = settings.socialLinks?.facebook  || "#";
  const tiktok    = settings.socialLinks?.tiktok    || "#";
  const whatsapp  = settings.socialLinks?.whatsapp  || "#";
  const email     = settings.contactEmail  || "hello@fluvasport.com";
  const phone     = settings.contactPhone  || "+20 100 000 0000";
  const address   = settings.storeAddress  || "6th October, Egypt";
  const siteName  = settings.siteName      || "Fluva Sport";

  return (
    <footer className="bg-black pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-gray-800 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

        {/* Brand Column */}
        <div className="md:col-span-1">
          <Link href="/" className="text-2xl font-serif tracking-widest text-orange-500 font-bold block mb-6 hover:text-orange-400 transition-colors duration-300">
            {siteName.toUpperCase()}
          </Link>
          <p className="text-gray-400 font-light max-w-xs text-balance mb-8">
            {t("footer_tagline")}
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-gray-400">
              <svg className="w-5 h-5 mt-0.5 text-gray-500 shrink-0 rtl-flip" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <div>
                <span className="block font-medium text-white text-xs tracking-widest uppercase mb-1">{t("footer_store_location")}</span>
                <span className="font-light text-sm">{address}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-400 pt-2">
              <svg className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div>
                <span className="block font-medium text-white text-xs tracking-widest uppercase mb-1">{t("footer_contact_us")}</span>
                <span className="font-light text-sm">{email}<br />{phone}</span>
              </div>
            </div>
            {whatsapp && whatsapp !== "#" && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-green-500 hover:text-green-400 transition-colors text-xs font-medium">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t("footer_whatsapp")}
              </a>
            )}
          </div>
        </div>

        {/* Shop Column */}
        <div>
          <h4 className="uppercase tracking-widest text-white font-bold mb-6">{t("footer_shop")}</h4>
          <ul className="space-y-4 text-gray-400 font-light">
            <li><Link href="/shop" className="hover:text-orange-500 transition-colors duration-300">{t("footer_all_swimwear")}</Link></li>
            <li><Link href="/shop?filter=Women" className="hover:text-orange-500 transition-colors duration-300">{t("footer_women")}</Link></li>
            <li><Link href="/shop?filter=Men" className="hover:text-orange-500 transition-colors duration-300">{t("footer_men")}</Link></li>
            <li><Link href="/shop?filter=Kids" className="hover:text-orange-500 transition-colors duration-300">{t("footer_kids")}</Link></li>
            <li><Link href="/shop?filter=Equipment" className="hover:text-orange-500 transition-colors duration-300">{t("footer_equipment")}</Link></li>
            <li><Link href="/shop?filter=Sale" className="hover:text-orange-500 transition-colors duration-300">{t("footer_sale")}</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="uppercase tracking-widest text-white font-bold mb-6">{t("footer_support")}</h4>
          <ul className="space-y-4 text-gray-400 font-light">
            <li><Link href="/contact" className="hover:text-orange-500 transition-colors duration-300">{t("footer_contact_us")}</Link></li>
            <li><Link href="#faq" className="hover:text-orange-500 transition-colors duration-300">{t("footer_faq")}</Link></li>
            <li><Link href="#shipping" className="hover:text-orange-500 transition-colors duration-300">{t("footer_shipping_returns")}</Link></li>
            <li><Link href="#size" className="hover:text-orange-500 transition-colors duration-300">{t("footer_size_guide")}</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="uppercase tracking-widest text-white font-bold mb-6">{t("footer_legal")}</h4>
          <ul className="space-y-4 text-gray-400 font-light">
            <li><Link href="#terms" className="hover:text-orange-500 transition-colors duration-300">{t("footer_terms")}</Link></li>
            <li><Link href="#privacy" className="hover:text-orange-500 transition-colors duration-300">{t("footer_privacy")}</Link></li>
            <li><Link href="#cookie" className="hover:text-orange-500 transition-colors duration-300">{t("footer_cookie")}</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8 mt-8">
        <p className="text-gray-600 font-light mb-4 md:mb-0">
          © {new Date().getFullYear()} {siteName}. {t("footer_rights")}
        </p>
        <div className="flex gap-6 text-gray-600">
          {instagram !== "#" && <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-300 font-light">Instagram</a>}
          {facebook  !== "#" && <a href={facebook}  target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-300 font-light">Facebook</a>}
          {tiktok    !== "#" && <a href={tiktok}    target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-300 font-light">TikTok</a>}
        </div>
      </div>
    </footer>
  );
}
