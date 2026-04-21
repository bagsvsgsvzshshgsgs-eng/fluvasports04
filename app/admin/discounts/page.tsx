"use client";

import { useStore, Discount } from "@/components/StoreContext";
import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Tag } from "lucide-react";

export default function DiscountsAdmin() {
  const { settings, updateSettings } = useStore();
  const discounts = settings.discounts || [];
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Discount>>({});

  const handleEdit = (discount: Discount) => {
    setEditingId(discount.id);
    setFormData(discount);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      updateSettings({ discounts: discounts.filter(d => d.id !== id) });
      if (editingId === id) setEditingId(null);
    }
  };

  const handleAddNew = () => {
    const newDiscount: Discount = {
      id: `disc_${Date.now()}`,
      code: "NEW10",
      type: "Percentage",
      value: 10,
      isActive: false,
    };
    updateSettings({ discounts: [...discounts, newDiscount] });
    handleEdit(newDiscount);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateSettings({
      discounts: discounts.map(d => d.id === editingId ? { ...d, ...formData } as Discount : d)
    });
    setEditingId(null);
  };

  const handleToggleActive = (id: string, current: boolean) => {
    updateSettings({ discounts: discounts.map(d => d.id === id ? { ...d, isActive: !current } : d) });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Discounts</h1>
          <p className="text-gray-400 text-sm">Create and manage promotional codes and automatic discounts.</p>
        </div>
        <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Plus size={16} /> Create Discount
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {discounts.map(discount => (
            <div key={discount.id} className="bg-black border border-gray-900 rounded-xl p-5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-orange-500">
                  <Tag size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-mono font-bold text-white tracking-widest">{discount.code}</h3>
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest rounded-full font-bold ${discount.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {discount.type === 'Percentage' ? `${discount.value}% OFF` : `EGP ${discount.value} OFF`}
                    {discount.expiryDate && ` • Expires ${discount.expiryDate}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleToggleActive(discount.id, discount.isActive)} className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800">
                  Toggle
                </button>
                <button onClick={() => handleEdit(discount)} className="p-2 text-orange-500 bg-orange-500/10 rounded-md hover:bg-orange-500/20">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(discount.id)} className="p-2 text-red-500 bg-red-500/10 rounded-md hover:bg-red-500/20">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {discounts.length === 0 && (
            <div className="p-12 border border-dashed border-gray-900 rounded-xl text-center">
              <Tag size={32} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500">No discount codes found. Create one to get started.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {editingId ? (
            <div className="bg-black border border-gray-900 rounded-xl p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif text-white">Edit Discount</h3>
                <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Discount Code</label>
                  <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-gray-900 text-white font-mono uppercase border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none" placeholder="SUMMER25" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Type</label>
                    <select value={formData.type || 'Percentage'} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none">
                      <option value="Percentage">Percentage</option>
                      <option value="FixedAmount">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Value</label>
                    <input type="number" value={formData.value || 0} onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Expiry Date (Optional)</label>
                  <input type="date" value={formData.expiryDate || ''} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none" />
                </div>
                <button onClick={handleSave} className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 mt-4">
                  <Save size={16} /> Save Discount
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/30 border border-gray-900 rounded-xl p-8 flex flex-col items-center justify-center text-center h-64 sticky top-24">
              <Tag size={32} className="text-gray-600 mb-4" />
              <p className="text-gray-500 text-sm">Select a discount code to edit its properties or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
