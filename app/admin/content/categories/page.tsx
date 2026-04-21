"use client";

import { useStore } from "@/components/StoreContext";
import { useState } from "react";
import { Save, X, Eye, Edit2 } from "lucide-react";
import Link from "next/link";

export default function CategoryShowcaseAdmin() {
  const { settings, updateSettings } = useStore();
  const categories = settings.categoryShowcase || [];
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData(category);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateSettings({
      categoryShowcase: categories.map(c => c.id === editingId ? { ...c, ...formData } : c)
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Category Showcase</h1>
          <p className="text-gray-400 text-sm">Manage the dynamic editorial-style shoppable collections on your homepage.</p>
        </div>
        <Link href="/" target="_blank" className="bg-gray-900 text-white px-5 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 border border-gray-800 shadow-sm">
          <Eye size={18} /> Preview Store
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-black border border-gray-900 rounded-xl p-6 shadow-sm">
            {editingId === category.id ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-900">
                  <h3 className="text-lg font-serif text-white">Edit Category Showcase</h3>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Title</label>
                    <input 
                      type="text" 
                      value={formData.title || ''} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-gray-900/50 text-white border border-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Subtitle</label>
                    <input 
                      type="text" 
                      value={formData.subtitle || ''} 
                      onChange={e => setFormData({...formData, subtitle: e.target.value})}
                      className="w-full bg-gray-900/50 text-white border border-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Link Destination</label>
                    <input 
                      type="text" 
                      value={formData.link || ''} 
                      onChange={e => setFormData({...formData, link: e.target.value})}
                      className="w-full bg-gray-900/50 text-white border border-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Accent Color (Hex)</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={formData.accentColor || '#ffffff'} 
                        onChange={e => setFormData({...formData, accentColor: e.target.value})}
                        className="h-10 w-12 rounded-md cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input 
                        type="text" 
                        value={formData.accentColor || ''} 
                        onChange={e => setFormData({...formData, accentColor: e.target.value})}
                        className="flex-1 bg-gray-900/50 text-white border border-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Featured Product IDs (Comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.productIds?.join(', ') || ''} 
                      onChange={e => setFormData({...formData, productIds: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})}
                      className="w-full bg-gray-900/50 text-white border border-gray-800 rounded-md px-4 py-2.5 focus:outline-none focus:border-orange-500"
                      placeholder="prod_1, prod_2"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-6 mt-2">
                  <button onClick={handleSave} className="bg-orange-500 text-white px-6 py-2.5 rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium">
                    <Save size={16} /> Save Category
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.accentColor }} 
                    />
                    <h2 className="text-xl font-serif text-white">{category.title}</h2>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{category.subtitle} • Links to: <span className="text-gray-500">{category.link}</span></p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-900 px-2 py-1 rounded">Products: {category.productIds.length}</span>
                    <span className="font-mono text-gray-600 truncate max-w-sm">{category.productIds.join(', ')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleEdit(category)}
                  className="px-4 py-2 text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 rounded-md transition-colors flex items-center gap-2 font-medium text-sm"
                >
                  <Edit2 size={14} /> Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
