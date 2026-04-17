"use client";

import { useStore } from "./StoreContext";

export default function AnnouncementBar() {
  const { settings } = useStore();
  
  return (
    <div className="bg-black text-orange-500 py-3 text-center text-xs tracking-widest font-bold uppercase font-sans shadow-lg">
      {settings.announcementText}
    </div>
  );
}

