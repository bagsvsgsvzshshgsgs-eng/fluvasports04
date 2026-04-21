"use client";

import { useStore } from "@/components/StoreContext";
import { useState } from "react";
import { Save, Globe, Type, Image as ImageIcon, Shield } from "lucide-react";

export default function SettingsAdmin() {
  const { settings, updateSettings } = useStore();
  
  const [formData, setFormData] = useState({
    announcementText: settings.announcementText || "",
    heroTitle: settings.heroTitle || "",
    heroSubtitle: settings.heroSubtitle || "",
    promoBannerText: settings.promoBannerText || "",
    heroImage: settings.heroImage || "",
    adminEmail: settings.adminEmail || "",
    adminPassword: settings.adminPassword || "",
    categoryImages: settings.categoryImages || {
      onePiece: "",
      bikini: "",
      resort: "",
    }
  });

  const handleSave = () => {
    updateSettings(formData);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Store Settings</h1>
          <p className="text-gray-400 text-sm">Manage global store text, announcements, default imagery, and admin credentials.</p>
        </div>
        <button onClick={handleSave} className="bg-orange-500 text-white px-6 py-2.5 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm">
          <Save size={18} /> Save Settings
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-black border border-gray-900 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-900">
              <Globe className="text-orange-500" size={24} />
              <h2 className="text-xl font-serif text-white">Global Announcements</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Top Bar Announcement</label>
                <input 
                  type="text" 
                  value={formData.announcementText} 
                  onChange={e => setFormData({...formData, announcementText: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" 
                />
                <p className="text-xs text-gray-500 mt-1.5">Displayed at the very top of the website on all pages.</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Promotional Banner Text</label>
                <input 
                  type="text" 
                  value={formData.promoBannerText} 
                  onChange={e => setFormData({...formData, promoBannerText: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" 
                />
                <p className="text-xs text-gray-500 mt-1.5">Secondary banner text used across the store.</p>
              </div>
            </div>
          </div>

          <div className="bg-black border border-gray-900 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-900">
              <Type className="text-orange-500" size={24} />
              <h2 className="text-xl font-serif text-white">Static Hero Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Default Hero Title</label>
                <input 
                  type="text" 
                  value={formData.heroTitle} 
                  onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Default Hero Subtitle</label>
                <textarea 
                  value={formData.heroSubtitle} 
                  onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors h-24" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black border border-gray-900 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-900">
              <ImageIcon className="text-orange-500" size={24} />
              <h2 className="text-xl font-serif text-white">Fallback Default Image</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Default Hero Image URL</label>
                <input 
                  type="text" 
                  value={formData.heroImage} 
                  onChange={e => setFormData({...formData, heroImage: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" 
                />
                <p className="text-xs text-gray-500 mt-1.5">Used if the dynamic hero banner carousel is empty or disabled.</p>
              </div>

              {formData.heroImage && (
                <div className="mt-4 border border-gray-800 rounded-xl overflow-hidden aspect-video relative bg-gray-900">
                  <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-black border border-gray-900 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-900">
              <Shield className="text-red-500" size={24} />
              <h2 className="text-xl font-serif text-white">Legacy Auth Credentials</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                These credentials are used as a fallback. For proper user management, please use the <a href="/admin/users" className="text-orange-500 hover:underline">Users</a> panel.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Admin Email</label>
                <input 
                  type="email" 
                  value={formData.adminEmail} 
                  onChange={e => setFormData({...formData, adminEmail: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Admin Password</label>
                <input 
                  type="text" 
                  value={formData.adminPassword} 
                  onChange={e => setFormData({...formData, adminPassword: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
