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
  items: CartItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

type SiteSettings = {
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  promoBannerText: string;
  categoryImages: {
    onePiece: string;
    bikini: string;
    resort: string;
  };
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
  wishlist: string[]; // Array of product IDs
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

  // Authentication
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;
};


const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // State initialization
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({

    announcementText: "Free worldwide shipping on all orders over $250",
    heroTitle: "The Essence of Summer Luxury",
    heroSubtitle: "Discover the new 2026 collection of meticulously crafted swimwear.",
    heroImage: "/images/fluva-hero.jpeg",
    promoBannerText: "Limited Edition: The Mediterranean Collection has arrived. Shop now.",
    categoryImages: {
      onePiece: "/images/category_one_piece_1776081471457.png",
      bikini: "/images/category_bikini_1776081526337.png",
      resort: "/images/category_coverups_1776081563632.png",
    }
  });


  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("flv_products");
    const savedCart = localStorage.getItem("flv_cart");
    const savedWishlist = localStorage.getItem("flv_wishlist");
    const savedReviews = localStorage.getItem("flv_reviews");
    const savedOrders = localStorage.getItem("flv_orders");
    const savedSettings = localStorage.getItem("flv_settings");
    const savedAuth = localStorage.getItem("flv_admin_auth");

    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      if (parsed.length === initialProducts.length) {
        setProducts(parsed);
      } else {
        // Force refresh from latest data source if lengths differ
        setProducts(initialProducts);
        localStorage.setItem("flv_products", JSON.stringify(initialProducts));
      }
    } else {
      setProducts(initialProducts);
    }

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedAuth) setIsAdminLoggedIn(JSON.parse(savedAuth));
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({
        ...prev,
        ...parsed,
        categoryImages: {
          ...prev.categoryImages,
          ...(parsed.categoryImages || {})
        }
      }));
    }

    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("flv_products", JSON.stringify(products));
    localStorage.setItem("flv_cart", JSON.stringify(cartItems));
    localStorage.setItem("flv_wishlist", JSON.stringify(wishlist));
    localStorage.setItem("flv_reviews", JSON.stringify(reviews));
    localStorage.setItem("flv_orders", JSON.stringify(orders));
    localStorage.setItem("flv_settings", JSON.stringify(settings));
    localStorage.setItem("flv_admin_auth", JSON.stringify(isAdminLoggedIn));
  }, [products, cartItems, wishlist, reviews, orders, settings, isAdminLoggedIn, isLoaded]);

  // Auth Logic
  const adminLogin = (email: string, pass: string) => {
    if (email === "admin@fluvasport.com" && pass === "admin123") {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  // Product Logic

  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(item => item.id !== id));

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
  };
  const deleteReview = (id: string) => setReviews(prev => prev.filter(r => r.id !== id));


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
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
  };

  // Settings Logic
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, cartCount, isCartOpen, setIsCartOpen,
      wishlist, toggleWishlist, isWishlistOpen, setIsWishlistOpen,
      reviews, addReview, updateReviewStatus, deleteReview,
      orders, addOrder, updateOrderStatus,
      settings, updateSettings,
      isAdminLoggedIn, adminLogin, adminLogout
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
