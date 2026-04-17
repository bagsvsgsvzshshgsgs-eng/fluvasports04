import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { StoreProvider } from "@/components/StoreContext";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <StoreProvider>
          {children}
          <CartDrawer />
          <WishlistDrawer />
        </StoreProvider>

      </body>
    </html>
  );
}

