import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { StoreProvider } from "@/components/StoreContext";
import { LanguageProvider } from "@/components/LanguageContext";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fluva Sport",
  description: "Premium swimwear and resort wear.",
};

// Blocking inline script: runs before React hydrates → zero flash of wrong language/dir
const langInitScript = `
(function() {
  try {
    var l = localStorage.getItem('fluva_locale');
    if (l === 'ar') {
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('font-arabic');
      document.documentElement.classList.remove('font-latin');
    } else {
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.classList.add('font-latin');
      document.documentElement.classList.remove('font-arabic');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased font-latin`}
    >
      <head />
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {/* Runs before hydration → no flash of wrong language on refresh */}
        <Script id="lang-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: langInitScript }} />
        <StoreProvider>
          <LanguageProvider>
            {children}
            <CartDrawer />
            <WishlistDrawer />
          </LanguageProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
