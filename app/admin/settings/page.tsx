"use client";

import { useStore } from "@/components/StoreContext";

export default function AdminSettings() {
  const { settings, updateSettings } = useStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-serif text-white mb-1">Store Settings</h1>
        <p className="text-gray-400 text-sm">Control your store's appearance and messaging.</p>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black border border-gray-800 shadow-sm col-span-1 md:col-span-2">
          <div className="p-6 border-b border-gray-800 bg-black/30">
            <h2 className="text-lg font-serif text-white">Announcement & Banner</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Announcement Bar Text</label>
              <input 
                type="text" 
                value={settings.announcementText}
                onChange={e => updateSettings({ announcementText: e.target.value })}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Promo Banner Text</label>
              <textarea 
                rows={2}
                value={settings.promoBannerText}
                onChange={e => updateSettings({ promoBannerText: e.target.value })}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none" 
              />
            </div>
          </div>
        </div>

        <div className="bg-black border border-gray-800 shadow-sm">
          <div className="p-6 border-b border-gray-800 bg-black/30">
            <h2 className="text-lg font-serif text-white">Hero Content</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Hero Title</label>
              <input 
                type="text" 
                value={settings.heroTitle}
                onChange={e => updateSettings({ heroTitle: e.target.value })}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Hero Subtitle</label>
              <textarea 
                rows={3}
                value={settings.heroSubtitle}
                onChange={e => updateSettings({ heroSubtitle: e.target.value })}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none" 
              />
            </div>
          </div>
        </div>

        <div className="bg-black border border-gray-800 shadow-sm col-span-1 md:col-span-2">
          <div className="p-6 border-b border-gray-800 bg-black/30">
            <h2 className="text-lg font-serif text-white">Visual Assets</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                Hero Background Image URL
                <span className="text-[10px] font-normal lowercase tracking-normal text-gray-500">(Direct image link)</span>
              </label>
              <input 
                type="text" 
                value={settings.heroImage}
                onChange={e => updateSettings({ heroImage: e.target.value })}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Category: One Pieces URL</label>
              <input 
                type="text" 
                value={settings.categoryImages.onePiece}
                onChange={e => updateSettings({ categoryImages: { ...settings.categoryImages, onePiece: e.target.value } })}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Category: Bikinis URL</label>
              <input 
                type="text" 
                value={settings.categoryImages.bikini}
                onChange={e => updateSettings({ categoryImages: { ...settings.categoryImages, bikini: e.target.value } })}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Category: Resort Wear URL</label>
              <input 
                type="text" 
                value={settings.categoryImages.resort}
                onChange={e => updateSettings({ categoryImages: { ...settings.categoryImages, resort: e.target.value } })}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div className="col-span-1 flex items-end">
              <p className="text-[10px] text-gray-500 italic">Recommended: High-resolution JPG or PNG (aspect ratio 4:5 for categories, 16:9 for hero).</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-gray-800 shadow-sm">
          <div className="p-6 border-b border-gray-800 bg-black/30">
            <h2 className="text-lg font-serif text-white">Contact & Support</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@fluvasport.com"
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Operating Hours</label>
              <input 
                type="text" 
                defaultValue="Mon - Fri, 9am - 6pm EST"
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
              />
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end pt-4">
          <button 
            type="submit"
            className="bg-orange-500 text-white px-10 py-4 text-sm uppercase tracking-widest font-medium hover:bg-gray-800 shadow-md luxury-transition hover-lift"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
