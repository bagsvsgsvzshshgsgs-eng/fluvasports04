"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/StoreContext";
import { useLanguage } from "@/components/LanguageContext";

export default function CheckoutFlow() {
  const { cartItems, clearCart, addOrder } = useStore();
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states (simplified for now)
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return acc + priceNum * item.quantity;
  }, 0);

  const handlePayNow = async () => {
    if (cartItems.length === 0) return;
    
    setIsSubmitting(true);
    // Mock processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Save order
    const newOrder = {
      id: `FLV-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`,
      customerName: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
      items: [...cartItems],
      total: subtotal,
      status: "Processing" as const,
      date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    const result = await addOrder(newOrder);
    if (result.success) {
      clearCart();
      router.push("/checkout/success");
    } else {
      alert(`Failed to save order: ${result.error}`);
      setIsSubmitting(false);
    }
  };



  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-20 items-start">
      {/* Left Column: Checkout Forms */}
      <div className="lg:col-span-7 xl:col-span-7">
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-white mb-8">{t("checkout_title")}</h1>
          {/* ... existing form fields ... */}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">{t("checkout_contact")}</h2>
            <p className="text-sm text-gray-400">
              {t("checkout_already_account")}{" "}
              <Link href="#login" className="text-white border-b border-orange-500 pb-0.5">
                {t("checkout_login")}
              </Link>
            </p>
          </div>
          <input
            type="email"
            placeholder={t("checkout_email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-gray-800 px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors mb-4"
          />
          <input
            type="tel"
            placeholder={t("checkout_phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-black border border-gray-800 px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors mb-4"
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-white focus:ring-orange-500 border-gray-800 rounded-none accent-gray-900"
              defaultChecked
            />
            <span className="text-sm text-gray-300">{t("checkout_news")}</span>
          </label>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-medium text-white mb-6">{t("checkout_shipping")}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder={t("checkout_first_name")} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-gray-800 px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
            <input type="text" placeholder={t("checkout_last_name")} value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-gray-800 px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
          </div>
          <input type="text" placeholder={t("checkout_address")} className="w-full border border-gray-800 px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder={t("checkout_city")} className="col-span-2 sm:col-span-1 border border-gray-800 px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
            <select className="col-span-2 sm:col-span-1 border border-gray-800 px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-transparent appearance-none">
              <option value="eg">Egypt</option>
            </select>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-medium text-white mb-6">{t("checkout_payment")}</h2>
          <div className="border border-orange-500 bg-orange-500/10 rounded-sm">
            <div className="p-4 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-[5px] border-orange-500 shrink-0" />
              <span className="text-sm font-bold text-white">{t("checkout_cod")}</span>
            </div>
            <div className="p-4 pt-0 text-sm text-gray-400">
              {t("checkout_cod_desc")}
            </div>
          </div>
        </div>

        <button 
          onClick={handlePayNow}
          disabled={isSubmitting || cartItems.length === 0 || !phone.trim() || !firstName.trim()}
          className="w-full bg-orange-500 text-black py-4 text-sm uppercase tracking-widest hover:bg-orange-600 shadow-md transition-colors text-center mt-4 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >

          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t("checkout_processing")}
            </>
          ) : `${t("checkout_pay_now")} — EGP ${subtotal.toFixed(2)}`}
        </button>

      </div>

      {/* Right Column: Order Summary */}
      <div className="mt-12 lg:mt-0 lg:col-span-5 xl:col-span-5 border border-gray-800 bg-gray-900 p-6 md:p-8 sticky top-24">
        <h2 className="text-lg font-serif text-white mb-6 border-b border-gray-800 pb-4">
          {t("checkout_order_summary")}
        </h2>

        <div className="flex flex-col gap-6 mb-8 border-b border-gray-800 pb-8">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-sm">Your cart is empty.</p>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="relative aspect-[3/4] w-20 overflow-hidden bg-black shrink-0 border border-gray-800">
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium z-10">
                    {item.quantity}
                  </span>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-400 uppercase">
                    {item.color} / {item.size}
                  </p>
                </div>
                <span className="text-sm text-white font-medium">{item.price}</span>
              </div>
            ))
          )}

          <div className="flex gap-3 mt-2">
            <input type="text" placeholder={t("checkout_discount")} className="flex-1 bg-black border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" />
          <button className="bg-gray-800 text-gray-300 px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-gray-700 transition-colors">
            {t("checkout_apply")}
          </button>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-800">
          <div className="flex justify-between items-center text-gray-300">
            <span>{t("checkout_subtotal")}</span>
            <span>EGP {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>{t("checkout_shipping")}</span>
            <span className="uppercase text-gray-500 text-xs tracking-wider">{t("checkout_shipping_calc")}</span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>{t("checkout_taxes")}</span>
            <span className="uppercase text-gray-500 text-xs tracking-wider">{t("checkout_shipping_calc")}</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <span className="font-medium text-white">{t("checkout_total")}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">EGP</span>
            <span className="text-2xl font-medium text-white">EGP {subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
