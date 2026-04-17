"use client";

import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/components/StoreContext";
import { Product } from "@/lib/data";

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "Bikinis",
    priceStr: "$100",
    description: "",
    image: "/images/product_bestseller_1_1776081629759.png",
    colors: ["bg-orange-500"],
    colorNames: ["Noir"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: false
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Bikinis",
      priceStr: "$100",
      description: "",
      image: "/images/product_bestseller_1_1776081629759.png",
      colors: ["bg-orange-500"],
      colorNames: ["Noir"],
      sizes: ["XS", "S", "M", "L", "XL"],
      isNew: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData } as Product);
    } else {
      const newProduct: Product = {
        ...formData,
        id: `prod_${Date.now()}`,
      } as Product;
      addProduct(newProduct);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Products</h1>
          <p className="text-gray-400 text-sm">Manage your inventory, prices, and product details.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-orange-500 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-gray-800 transition-colors shadow-md"
        >
          Add Product
        </button>
      </header>

      <div className="bg-black border border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
               <input 
                 type="text" 
                 placeholder="Search products..." 
                 className="bg-black border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-64" 
               />
               <select className="bg-black border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-orange-500 appearance-none min-w-[120px]">
                 <option>All Categories</option>
                 <option>Bikini</option>
                 <option>One Piece</option>
                 <option>Resort Wear</option>
               </select>
            </div>
            <p className="text-gray-400 text-sm">{products.length} Products Total</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black text-gray-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-black/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-[3/4] w-12 bg-gray-900 shrink-0 border border-gray-800">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-white">{product.priceStr}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${product.id.startsWith('prod_1') ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                       {product.id.startsWith('prod_1') ? 'Active' : 'Stocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                     <button 
                      onClick={() => openEditModal(product)}
                      className="text-gray-500 hover:text-white font-medium"
                     >
                        Edit
                     </button>
                     <button 
                      onClick={() => { if(confirm("Are you sure?")) deleteProduct(product.id) }}
                      className="text-gray-300 hover:text-red-500 font-medium transition-colors"
                     >
                        Delete
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-orange-500/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-serif text-white">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 bg-transparent"
                  >
                    <option>Bikini</option>
                    <option>One Piece</option>
                    <option>Resort Wear</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Price (String)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.priceStr}
                    onChange={e => setFormData({...formData, priceStr: e.target.value})}
                    className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
                    placeholder="$0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Image URL</label>
                  <input 
                    required
                    type="text" 
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Color Classes (comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.colors?.join(", ") || ""}
                    onChange={e => setFormData({...formData, colors: e.target.value.split(",").map(s => s.trim())})}
                    placeholder="bg-orange-500, bg-black"
                    className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Color Names (comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.colorNames?.join(", ") || ""}
                    onChange={e => setFormData({...formData, colorNames: e.target.value.split(",").map(s => s.trim())})}
                    placeholder="Noir, Blanc"
                    className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Sizes (comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.sizes?.join(", ") || ""}
                    onChange={e => setFormData({...formData, sizes: e.target.value.split(",").map(s => s.trim())})}
                    placeholder="XS, S, M, L, XL"
                    className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none" 
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={formData.isNew}
                  onChange={e => setFormData({...formData, isNew: e.target.checked})}
                  className="w-4 h-4 accent-gray-900" 
                />
                <label className="text-sm text-gray-400 tracking-wide">Mark as New Arrival</label>
              </div>

              <div className="pt-6 border-t border-gray-800 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 text-sm uppercase tracking-widest font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-orange-500 text-white px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-gray-800 shadow-md luxury-transition"
                >
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
