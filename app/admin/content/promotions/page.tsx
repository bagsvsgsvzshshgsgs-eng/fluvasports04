"use client";

import { useStore, Promotion } from "@/components/StoreContext";
import { useState } from "react";
import { Edit2, Eye, EyeOff, Save, X } from "lucide-react";

export default function PromotionsAdmin() {
  const { settings, updateSettings } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Promotion>>({});
  
  const promotions = settings.promotions || [];

  const handleEdit = (promo: Promotion) => {
    setEditingId(promo.id);
    setFormData(promo);
  };

  const handleSave = () => {
    if (!editingId) return;
    
    updateSettings({
      promotions: promotions.map(p => p.id === editingId ? { ...p, ...formData } as Promotion : p)
    });
    setEditingId(null);
  };

  const handleToggleActive = (id: string, current: boolean) => {
    updateSettings({
      promotions: promotions.map(p => p.id === id ? { ...p, isActive: !current } : p)
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Promotions & Sections</h1>
          <p className="text-gray-400 text-sm">Manage dynamic homepage sections like Sale and Planet Water.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-black border border-gray-900 rounded-xl overflow-hidden shadow-sm">
            {editingId === promo.id ? (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-serif text-white">Edit Promotion</h3>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Title</label>
                    <input 
                      type="text" 
                      value={formData.title || ''} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Subtitle</label>
                    <input 
                      type="text" 
                      value={formData.subtitle || ''} 
                      onChange={e => setFormData({...formData, subtitle: e.target.value})}
                      className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      value={formData.description || ''} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:outline-none focus:border-orange-500 h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                    <input 
                      type="text" 
                      value={formData.image || ''} 
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:outline-none focus:border-orange-500"
                      placeholder="/images/your-image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Link URL</label>
                    <input 
                      type="text" 
                      value={formData.link || ''} 
                      onChange={e => setFormData({...formData, link: e.target.value})}
                      className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:outline-none focus:border-orange-500"
                      placeholder="/shop"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-6 border-t border-gray-900 mt-6">
                  <button onClick={handleSave} className="bg-orange-500 text-white px-6 py-2.5 rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-72 h-56 bg-gray-900 shrink-0 border-r border-gray-900">
                  <img src={promo.image} alt={promo.title} className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between bg-black">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-1 bg-gray-900 text-gray-300 text-[10px] uppercase tracking-widest rounded-md font-bold border border-gray-800">{promo.type}</span>
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest rounded-md font-bold flex items-center gap-1.5 border ${promo.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-900 text-gray-500 border-gray-800'}`}>
                        {promo.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {promo.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif text-white mb-2">{promo.title}</h2>
                    <p className="text-orange-500 text-sm font-medium mb-3">{promo.subtitle}</p>
                    <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{promo.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-900">
                    <button 
                      onClick={() => handleToggleActive(promo.id, promo.isActive)}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors border border-gray-800 shadow-sm"
                    >
                      {promo.isActive ? 'Hide Section' : 'Show Section'}
                    </button>
                    <button 
                      onClick={() => handleEdit(promo)}
                      className="px-4 py-2 bg-orange-500/10 text-orange-500 text-sm font-medium rounded-md hover:bg-orange-500/20 transition-colors border border-orange-500/20 flex items-center gap-2 shadow-sm"
                    >
                      <Edit2 size={14} /> Edit Content
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
