"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/components/StoreContext";


export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { adminLogin } = useStore();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(email, password)) {
       router.push("/admin");
    } else {
       setError("Invalid credentials. Please contact development for access.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-gray-900/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-gray-900/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-md w-full bg-black p-12 border border-gray-800 shadow-2xl relative z-10">
        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-serif tracking-[0.25em] font-light text-white leading-none">
            FLUVA<br/><span className="text-xs tracking-[0.6em] ml-1">SPORT</span>
          </Link>
          <div className="h-[1px] w-12 bg-gray-800 mx-auto mt-8 mb-6" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Administrative Access</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-bold text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="admin@fluvasport.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-800 px-0 py-4 text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-300"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Security Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-800 px-0 py-4 text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-600 bg-transparent text-white"
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-orange-500 text-black py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Authorize Session
            </button>
          </div>
        </form>

        <div className="mt-16 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white hover:border-b border-orange-500 pb-1 transition-all">
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

