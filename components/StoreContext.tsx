"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { allProducts as initialProducts, Product } from "@/lib/data";

type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  color: string;
  size: string;
};

type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  items: CartItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

type CategoryShowcaseItem = {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  accentColor: string;
  productIds: string[];
};

export type ActivityLog = {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  category: 'product' | 'order' | 'review' | 'settings' | 'user' | 'system';
};

export type Role = 'SuperAdmin' | 'Editor';

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'Active' | 'Suspended';
};

export type Promotion = {
  id: string;
  type: 'PlanetWater' | 'Sale';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  isActive: boolean;
};

export type Discount = {
  id: string;
  code: string;
  type: 'Percentage' | 'FixedAmount';
  value: number;
  isActive: boolean;
  expiryDate?: string;
};

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  banner: string;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  showOnHomepage: boolean;
  order: number;
  featuredProductIds: string[];
  subcategories: SubCategory[];
  type?: 'Standard' | 'BundleDeals' | 'Sale';
};

export type Bundle = {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  discountPercentage: number;
  isActive: boolean;
  image: string;
};

export type SaleSchedule = {
  id: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  discountPercentage: number;
  isActive: boolean;
};

export type SiteSettings = {
  // Content
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroBanners: HeroBanner[];
  promoBannerText: string;
  promotions: Promotion[];
  discounts: Discount[];
  adminUsers: AdminUser[];
  mediaLibrary: string[];
  categoryImages: {
    onePiece: string;
    bikini: string;
    resort: string;
  };
  categoryShowcase: CategoryShowcaseItem[];
  categories: Category[];
  bundles: Bundle[];
  saleSchedules: SaleSchedule[];
  adminEmail?: string;
  adminPassword?: string;
  // Site Identity
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  logoUrl: string;
  // Social Media
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
  };
  // Global SEO
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoOgImage: string;
  // Theme
  primaryColor: string;
  fontFamily: string;
  // System
  maintenanceMode: boolean;
};


type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
};

type StoreContextType = {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Cart
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "status" | "date">) => void;
  updateReviewStatus: (id: string, status: Review["status"]) => void;
  deleteReview: (id: string) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;

  // Settings
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;

  // Activity Logs
  activityLogs: ActivityLog[];
  addLog: (action: string, category: ActivityLog['category']) => void;
  clearLogs: () => void;

  // Authentication
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;
};


const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // State initialization
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Activity log helper (defined before settings to avoid TDZ issues)
  const addLog = (action: string, category: ActivityLog['category']) => {
    const user = adminUser?.name || 'System';
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      action,
      user,
      timestamp: new Date().toISOString(),
      category,
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 500)); // cap at 500
  };

  const clearLogs = () => {
    setActivityLogs([]);
    localStorage.removeItem('flv_logs');
  };

  const [settings, setSettings] = useState<SiteSettings>({

    announcementText: "Free worldwide shipping on all orders over $250",
    heroTitle: "The Signature Mediterranean Edit",
    heroSubtitle: "Transforming the resort wardrobe with sustainable, contemporary elegance.",
    heroImage: "/images/fluva-hero.jpeg",
    heroBanners: [
      {
        id: "banner_1",
        title: "The Signature Mediterranean Edit",
        subtitle: "Transforming the resort wardrobe with sustainable, contemporary elegance.",
        image: "/images/fluva-hero.jpeg",
        link: "/shop",
        isActive: true,
        order: 1
      }
    ],
    promoBannerText: "Free Express Shipping on All Global Orders for a Limited Time",
    promotions: [
      {
        id: "promo_pw",
        type: "PlanetWater",
        title: "PLANET WATER",
        subtitle: "Sustainable Performance",
        description: "Our new eco-inspired swimwear line crafted from recycled ocean plastics.",
        image: "/images/category_coverups_1776081563632.png",
        link: "/shop?filter=Eco",
        isActive: true
      }
    ],
    discounts: [],
    adminUsers: [
      {
        id: "admin_1",
        email: "Fluvasport@gmail.com",
        name: "Super Admin",
        role: "SuperAdmin",
        status: "Active"
      }
    ],
    mediaLibrary: [],
    categoryImages: {
      onePiece: "/images/category_one_piece_1776081471457.png",
      bikini: "/images/category_bikini_1776081526337.png",
      resort: "/images/category_coverups_1776081563632.png",
    },
    categoryShowcase: [
      {
        id: "one-pieces",
        title: "The One Piece",
        subtitle: "Elevated silhouettes",
        link: "/shop?filter=One+Pieces",
        accentColor: "#c8a96e",
        productIds: ["prod_4", "prod_5", "prod_1", "prod_2"],
      },
      {
        id: "bikinis",
        title: "Signature Bikinis",
        subtitle: "Summer's finest",
        link: "/shop?filter=Bikinis",
        accentColor: "#e07b4a",
        productIds: ["prod_2", "prod_1", "prod_3", "prod_5"],
      },
      {
        id: "resort",
        title: "Resort Cover-Ups",
        subtitle: "Poolside to penthouse",
        link: "/shop?filter=Cover-Ups",
        accentColor: "#9ba89c",
        productIds: ["prod_8", "prod_6", "prod_9", "prod_7"],
      },
    ],
    categories: [
      {
        id: "cat_women",
        name: "Women",
        slug: "women",
        image: "/images/category_one_piece_1776081471457.png",
        banner: "",
        seoTitle: "Women's Luxury Swimwear",
        seoDescription: "Shop our latest collection of premium women's swimwear.",
        isActive: true,
        showOnHomepage: true,
        order: 1,
        featuredProductIds: [],
        subcategories: [
          { id: "sub_bikinis", name: "Bikinis", slug: "women/bikinis" },
          { id: "sub_one_pieces", name: "One Pieces", slug: "women/one-pieces" }
        ],
        type: 'Standard'
      },
      {
        id: "cat_men",
        name: "Men",
        slug: "men",
        image: "/images/category_resortwear_1776341899337.png",
        banner: "",
        seoTitle: "Men's Swimwear",
        seoDescription: "Premium men's swimwear and resort wear.",
        isActive: true,
        showOnHomepage: true,
        order: 2,
        featuredProductIds: [],
        subcategories: [],
        type: 'Standard'
      },
      {
        id: "cat_sale",
        name: "Sale",
        slug: "sale",
        image: "",
        banner: "",
        seoTitle: "Sale & Clearance",
        seoDescription: "Discounts on premium swimwear.",
        isActive: true,
        showOnHomepage: true,
        order: 3,
        featuredProductIds: [],
        subcategories: [],
        type: 'Sale'
      },
      {
        id: "cat_bundles",
        name: "Bundle Deals",
        slug: "bundles",
        image: "",
        banner: "",
        seoTitle: "Exclusive Bundle Deals",
        seoDescription: "Save more with our curated bundles.",
        isActive: true,
        showOnHomepage: true,
        order: 4,
        featuredProductIds: [],
        subcategories: [],
        type: 'BundleDeals'
      },
      {
        id: "cat_kids",
        name: "Kids",
        slug: "kids",
        image: "/images/category_kids_1776342027791.png",
        banner: "",
        seoTitle: "Kids Swimwear",
        seoDescription: "Premium swimwear for kids.",
        isActive: true,
        showOnHomepage: true,
        order: 5,
        featuredProductIds: [],
        subcategories: [],
        type: 'Standard'
      },
      {
        id: "cat_equipment",
        name: "Equipment",
        slug: "equipment",
        image: "/images/category_pool_accessories_1776341916449.png",
        banner: "",
        seoTitle: "Swim Equipment",
        seoDescription: "Professional and leisure swim equipment.",
        isActive: true,
        showOnHomepage: true,
        order: 6,
        featuredProductIds: [],
        subcategories: [],
        type: 'Standard'
      }
    ],
    bundles: [],
    saleSchedules: [],
    adminEmail: "Fluvasport@gmail.com",
    adminPassword: "wateryclone123",
    // Site Identity
    siteName: "Fluva Sport",
    siteTagline: "Mediterranean Luxury Swimwear",
    contactEmail: "Fluvasport@gmail.com",
    contactPhone: "01140377799",
    storeAddress: "6th October, Egypt",
    logoUrl: "",
    // Social Media
    socialLinks: {
      instagram: "https://instagram.com/fluvasport",
      facebook: "https://facebook.com/fluvasport",
      tiktok: "https://tiktok.com/@fluvasport",
      whatsapp: "https://wa.me/201000000000",
    },
    // Global SEO
    seoMetaTitle: "Fluva Sport — Mediterranean Luxury Swimwear",
    seoMetaDescription: "Discover premium, sustainable swimwear crafted in the spirit of the Mediterranean. Shop the latest collections at Fluva Sport.",
    seoOgImage: "/images/fluva-hero.jpeg",
    // Theme
    primaryColor: "#f97316",
    fontFamily: "Inter",
    // System
    maintenanceMode: false,
  });


  const [isLoaded, setIsLoaded] = useState(false);

  // Load from API
  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, ordersRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/settings'),
        ]);

        if (productsRes.ok) {
          const fetchedProducts = await productsRes.json();
          setProducts(fetchedProducts);
        } else {
          setProducts(initialProducts);
        }

        if (ordersRes.ok) {
          const fetchedOrders = await ordersRes.json();
          setOrders(fetchedOrders);
        }

        if (settingsRes.ok) {
          const fetchedSettings = await settingsRes.json();
          setSettings(prev => ({
            ...prev,
            ...fetchedSettings,
            // Keep hardcoded defaults for sensitive fields if missing
            contactEmail: fetchedSettings.contactEmail || "Fluvasport@gmail.com",
            contactPhone: fetchedSettings.contactPhone || "01140377799",
            storeAddress: fetchedSettings.storeAddress || "6th October, Egypt",
            adminEmail: fetchedSettings.adminEmail || "Fluvasport@gmail.com",
          }));
        }

        // Local UI state
        const savedCart = localStorage.getItem("flv_cart");
        const savedWishlist = localStorage.getItem("flv_wishlist");
        const savedReviews = localStorage.getItem("flv_reviews");
        const savedAuth = localStorage.getItem("flv_admin_auth");
        const savedLogs = localStorage.getItem("flv_logs");

        if (savedCart) setCartItems(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedReviews) setReviews(JSON.parse(savedReviews));
        if (savedLogs) setActivityLogs(JSON.parse(savedLogs));

        if (savedAuth) {
          if (!localStorage.getItem("flv_pwd_reset_v2")) {
            setIsAdminLoggedIn(false);
            localStorage.setItem("flv_admin_auth", "false");
            localStorage.setItem("flv_pwd_reset_v2", "true");
          } else {
            setIsAdminLoggedIn(JSON.parse(savedAuth));
          }
        }
      } catch (e) {
        console.error("Failed to load data from API", e);
        setProducts(initialProducts);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("flv_cart", JSON.stringify(cartItems));
    localStorage.setItem("flv_wishlist", JSON.stringify(wishlist));
    localStorage.setItem("flv_reviews", JSON.stringify(reviews));
    localStorage.setItem("flv_admin_auth", JSON.stringify(isAdminLoggedIn));
    localStorage.setItem("flv_logs", JSON.stringify(activityLogs));
  }, [cartItems, wishlist, reviews, isAdminLoggedIn, activityLogs, isLoaded]);

  // Auth Logic
  const adminLogin = (email: string, pass: string) => {
    const validEmail = settings.adminEmail || "Fluvasport@gmail.com";
    const validPass = settings.adminPassword || "wateryclone123";
    
    const user = settings.adminUsers?.find(u => u.email.toLowerCase() === email.toLowerCase() && u.status === 'Active');

    if ((email.toLowerCase() === validEmail.toLowerCase() && pass === validPass) || (user && pass === validPass)) {
      setIsAdminLoggedIn(true);
      setAdminUser(user || settings.adminUsers?.[0] || null);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  // Product Logic
  const addProduct = async (p: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts(prev => [saved, ...prev]);
        addLog(`Added product: ${saved.name}`, 'product');
      }
    } catch (e) { console.error(e); }
  };
  const updateProduct = async (p: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(item => item.id === updated.id ? updated : item));
        addLog(`Updated product: ${updated.name}`, 'product');
      }
    } catch (e) { console.error(e); }
  };
  const deleteProduct = async (id: string) => {
    try {
      // Logic for delete API if implemented, otherwise just local for now
      // Assuming products API doesn't have DELETE yet but I'll add it if needed
      const name = products.find(p => p.id === id)?.name || id;
      setProducts(prev => prev.filter(item => item.id !== id));
      addLog(`Deleted product: ${name}`, 'product');
    } catch (e) { console.error(e); }
  };

  // Wishlist Logic
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
    );
  };

  // Review Logic
  const addReview = (r: Omit<Review, "id" | "status" | "date">) => {
    const newReview: Review = {
      ...r,
      id: `rev_${Date.now()}`,
      status: "Pending",
      date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setReviews(prev => [newReview, ...prev]);
  };
  const updateReviewStatus = (id: string, status: Review["status"]) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    addLog(`Review ${id} marked as ${status}`, 'review');
  };
  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    addLog(`Deleted review ${id}`, 'review');
  };


  // Cart Logic
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCartItems(prev => prev.filter(item => item.id !== id));
  
  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Order Logic
  const addOrder = async (order: Order) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (res.ok) {
        const saved = await res.json();
        setOrders(prev => [saved, ...prev]);
        addLog(`New order placed: ${saved.id} by ${saved.customerName}`, 'order');
        return true;
      }
      return false;
    } catch (e) { 
      console.error(e);
      return false;
    }
  };
  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      const order = orders.find(o => o.id === id);
      if (!order) return;
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, status })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        addLog(`Order ${id} status changed to ${status}`, 'order');
      }
    } catch (e) { console.error(e); }
  };

  // Settings Logic
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, ...newSettings })
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        addLog(`Settings updated`, 'settings');
      }
    } catch (e) { console.error(e); }
  };

  return (
    <StoreContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, cartCount, isCartOpen, setIsCartOpen,
      wishlist, toggleWishlist, isWishlistOpen, setIsWishlistOpen,
      reviews, addReview, updateReviewStatus, deleteReview,
      orders, addOrder, updateOrderStatus,
      settings, updateSettings,
      activityLogs, addLog, clearLogs,
      isAdminLoggedIn, adminUser, adminLogin, adminLogout
    }}>

      {children}
    </StoreContext.Provider>
  );
}


export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
