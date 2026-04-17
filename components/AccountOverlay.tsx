"use client";

import { useState } from "react";
import Link from "next/link";

export default function AccountOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-orange-500/40 backdrop-blur-sm z-[110] transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-black z-[111] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out translate-x-0 border-l border-gray-800">
        
        <div className="p-8 flex justify-between items-center bg-black sticky top-0 z-10">
          <h2 className="text-2xl font-serif text-white">{mode === "login" ? "Login" : "Create Account"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4">
          {/* Admin Quick Access - Premium Card */}
          <div className="mb-10 group cursor-pointer" onClick={() => { window.location.href = "/admin"; onClose(); }}>
            <div className="bg-orange-500 p-6 shadow-xl relative overflow-hidden transition-all duration-500 hover:bg-gray-800">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg width="80" height="80" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
               </div>
               <div className="relative z-10">
                 <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-2 block">Site Management</span>
                 <h3 className="text-xl font-serif text-white mb-4">Admin Dashboard</h3>
                 <div className="flex items-center gap-2 text-xs text-white/70 uppercase tracking-widest font-medium">
                   Access Control Overview
                   <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                 </div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] bg-gray-900 flex-1"></div>
            <span className="text-[10px] uppercase tracking-widest text-gray-300">Customer Portal</span>
            <div className="h-[1px] bg-gray-900 flex-1"></div>
          </div>

          <p className="text-gray-400 font-light mb-8 text-sm leading-relaxed">
            {mode === "login" 
              ? "Please enter your e-mail and password to access your orders:" 
              : "Please fill in the information below to create a customer account:"}
          </p>

          <form className="space-y-6">
            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" />
                  <input type="text" placeholder="Last Name" className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" />
                </div>
              </>
            )}
            <input type="email" placeholder="E-mail" className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" />
            <input type="password" placeholder="Password" className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" />
            
            <button 
              type="button" 
              onClick={onClose}
              className="w-full bg-black border border-gray-800 text-white py-4 text-xs uppercase tracking-widest font-medium hover:bg-black transition-all"
            >
              {mode === "login" ? "Customer Log in" : "Create Account"}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
             <p className="text-gray-400 text-sm mb-4">
               {mode === "login" ? "Don't have an account?" : "Already have an account?"}
             </p>
             <button 
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm font-medium uppercase tracking-[0.2em] text-white border-b border-orange-500 pb-1 hover:text-gray-400 hover:border-gray-500 transition-colors"
             >
               {mode === "login" ? "Register Now" : "Back to Login"}
             </button>
          </div>
        </div>

      </div>
    </>
  );
}
