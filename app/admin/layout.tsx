"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/components/StoreContext";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings, 
  Users, 
  Tags, 
  Image as ImageIcon,
  LogOut,
  Home,
  Menu,
  X,
  Bell,
  Search,
  Layers,
  Star,
  MonitorPlay,
  Eye,
  ClipboardList,
  GitFork
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminLoggedIn, adminLogout, adminUser } = useStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-500 font-serif tracking-widest text-sm animate-pulse">AUTHORIZING SESSION...</div>
      </div>
    );
  }

  const navGroups = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      title: "Store",
      items: [
        { label: "Orders", href: "/admin/orders", icon: <ShoppingCart size={18} /> },
        { label: "Products", href: "/admin/products", icon: <Package size={18} /> },
        { label: "Categories", href: "/admin/categories", icon: <Tags size={18} /> },
        { label: "Category Tree", href: "/admin/categories/tree", icon: <GitFork size={18} /> },
        { label: "Customers", href: "/admin/customers", icon: <Users size={18} /> },
        { label: "Reviews", href: "/admin/reviews", icon: <Star size={18} /> },
      ]
    },
    {
      title: "Content",
      items: [
        { label: "Banners", href: "/admin/content/banners", icon: <Layers size={18} /> },
        { label: "Promotions", href: "/admin/content/promotions", icon: <Tags size={18} /> },
        { label: "Showcase", href: "/admin/showcase", icon: <MonitorPlay size={18} /> },
        { label: "Discounts", href: "/admin/discounts", icon: <Tags size={18} /> },
        { label: "Media Library", href: "/admin/media", icon: <ImageIcon size={18} /> },
      ]
    },
    {
      title: "System",
      items: [
        { label: "Activity Logs", href: "/admin/logs",  icon: <ClipboardList size={18} />, superOnly: true },
        { label: "Users",    href: "/admin/users",    icon: <Users size={18} />,    superOnly: true },
        { label: "Settings", href: "/admin/settings", icon: <Settings size={18} />, superOnly: false },
      ]
    }
  ];

  const isSuperAdmin = adminUser?.role === 'SuperAdmin';

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-sans text-gray-300">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-black text-gray-300 flex flex-col fixed h-full shadow-2xl z-30 border-r border-gray-900 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-900 flex justify-between items-center">
          <div>
            <Link href="/admin" className="text-xl font-serif tracking-widest font-bold block">
              FLUVA <span className="text-orange-500">ADMIN</span>
            </Link>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Internal Management</p>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-8">
              <h3 className="px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">{group.title}</h3>
              <ul className="space-y-1">
                {group.items.filter(item => !('superOnly' in item) || !item.superOnly || isSuperAdmin).map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-300 border-l-2 ${
                          isActive 
                            ? "bg-gray-900/50 text-orange-500 border-orange-500" 
                            : "text-gray-400 hover:text-white hover:bg-gray-900/30 border-transparent"
                        }`}
                      >
                        <span className={`${isActive ? 'text-orange-500' : 'text-gray-500'}`}>{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 bg-black border-t border-gray-900">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-white transition-colors font-medium rounded-md hover:bg-gray-900/50">
            <Home size={18} />
            View Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="h-16 bg-black border-b border-gray-900 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-gray-900 px-3 py-2 rounded-md border border-gray-800">
              <Search size={16} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Search operations..." className="bg-transparent border-none outline-none text-sm w-64 text-white placeholder-gray-600 focus:ring-0" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" target="_blank" className="hidden md:flex items-center gap-2 text-sm font-medium text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 px-4 py-2 rounded-md transition-colors border border-orange-500/20 shadow-sm">
              <Eye size={16} />
              Preview Store
            </Link>

            <button className="text-gray-400 hover:text-white relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
              <div className="w-8 h-8 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center font-bold text-sm border border-orange-500/20">
                {adminUser?.name?.charAt(0) || "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{adminUser?.name || "Administrator"}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{adminUser?.role || "SuperAdmin"}</p>
              </div>
              
              <button 
                onClick={() => {
                  if (confirm("Log out of the administrative session?")) {
                    adminLogout();
                    router.push("/admin/login");
                  }
                }}
                className="text-gray-500 hover:text-red-500 ml-4 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 overflow-auto w-full">
          <div className="max-w-7xl mx-auto w-full animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
