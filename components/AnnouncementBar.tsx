"use client";

import { useStore } from "./StoreContext";

export default function AnnouncementBar() {
  const { settings } = useStore();
  
  return (
    <div className="bg-black text-gray-200 py-3 text-center text-xs tracking-[0.2em] font-medium uppercase font-sans border-b border-gray-800 backdrop-blur-md">
      Free shipping and returns
    </div>
  );
}

