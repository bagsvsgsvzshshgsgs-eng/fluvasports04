"use client";

import Link from "next/link";
import { useStore } from "./StoreContext";

export default function AnnouncementBar() {
  const { settings } = useStore();
  
  return (
    <div className="bg-black text-gray-200 py-2 px-4 md:px-8 text-xs tracking-[0.15em] font-medium uppercase font-sans border-b border-gray-800 backdrop-blur-md flex justify-between items-center">
      {/* Links removed as requested */}
      <div className="flex-1 text-center text-[10px] sm:text-xs tracking-[0.2em]">
        Free shipping and returns
      </div>
      <div className="hidden md:block w-[150px]"></div> {/* Spacer to balance the layout */}
    </div>
  );
}

