"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/components/StoreContext";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminLoggedIn, adminLogout } = useStore();
  const [isChecking, setIsChecking] = useState(true);

  // Authentication Guard
  useEffect(() => {
    if (pathname !== "/admin/login") {
      if (!isAdminLoggedIn) {
        router.push("/admin/login");
      } else {
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [isAdminLoggedIn, pathname, router]);

  // Handle Login page differently (no sidebar)
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  // Prevent flash of content
  if (isChecking) {
    return (
      <div className="min-h-screen bg-orange-500 flex items-center justify-center">
        <div className="text-white font-serif tracking-widest text-sm animate-pulse">AUTHORIZING SESSION...</div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Orders", href: "/admin/orders", icon: "📦" },
    { label: "Products", href: "/admin/products", icon: "👙" },
    { label: "Reviews", href: "/admin/reviews", icon: "⭐" },
    { label: "Customers", href: "/admin/customers", icon: "👥" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen bg-black font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-orange-500 text-white flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-8 border-b border-white/5">
          <Link href="/admin" className="text-xl font-serif tracking-widest font-bold block mb-1">
            FLUVA <span className="text-gray-500">ADMIN</span>
          </Link>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Internal Management</p>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-black/10 text-white shadow-inner" 
                    : "text-gray-500 hover:text-white hover:bg-black/5"
                }`}
              >
                <span className="text-base grayscale group-hover:grayscale-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 bg-black/20 border-t border-white/5">
          <Link href="/" className="flex items-center gap-4 px-4 py-3 text-xs text-gray-500 hover:text-white transition-all uppercase tracking-widest font-medium">
            <span>🏠</span>
            Storefront
          </Link>
          <button 
            onClick={() => {
              if (confirm("Log out of the administrative session?")) {
                adminLogout();
                router.push("/admin/login");
              }
            }}
            className="w-full flex items-center gap-4 px-4 py-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-lg uppercase tracking-widest font-bold"
          >
            <span>🔐</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12 relative">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  );
}
