"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useStore } from "@/components/StoreContext";
import { Product } from "@/lib/data";
import { Search, Plus, Edit2, Trash2, X, Filter, CheckSquare, Settings2, Tag } from "lucide-react";

const DISPLAY_LOCATIONS = [
  { id: "homepage", label: "Homepage Showcase" },
  { id: "category_featured", label: "Category Featured" },
  { id: "search_only", label: "Search Only (Hide from lists)" }
];

const AVAILABLE_IMAGES = [
  { label: "Best Seller 1", value: "/images/product_bestseller_1_1776081629759.png" },
  { label: "Best Seller 2", value: "/images/product_bestseller_2_1776081693616.png" },
  { label: "One Piece", value: "/images/category_one_piece_1776081471457.png" },
  { label: "Bikini", value: "/images/category_bikini_1776081526337.png" },
  { label: "Cover-Up", value: "/images/category_coverups_1776081563632.png" },
  { label: "Resort Wear", value: "/images/category_resortwear_1776341899337.png" },
  { label: "Kids", value: "/images/category_kids_1776342027791.png" },
  { label: "Pool Accessories", value: "/images/category_pool_accessories_1776341916449.png" },
];

const EMPTY_FORM: Omit<Product, "id"> = {
  name: "",
  category: "Uncategorized",
  categoryId: "",
  subcategoryId: "",
  price: 0,
  priceStr: "",
  description: "",
  image: "/images/product_bestseller_1_1776081629759.png",
  images: [],
  colors: ["bg-stone-900"],
  colorNames: ["Noir"],
  sizes: ["XS", "S", "M", "L", "XL"],
  isNew: true,
  displayLocations: [],
  badges: [],
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, settings } = useStore();
  const categories = settings.categories || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Bulk Operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
  const [bulkCategoryId, setBulkCategoryId] = useState("");

  // Form State
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_FORM);
  const [priceInput, setPriceInput] = useState("");
  const [badgeInput, setBadgeInput] = useState("");

  // Sync price string from numeric input
  useEffect(() => {
    const num = parseFloat(priceInput);
    if (!isNaN(num) && num > 0) {
      setForm((f) => ({ ...f, price: num, priceStr: `EGP ${num}` }));
    }
  }, [priceInput]);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setPriceInput("");
    setBadgeInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      categoryId: p.categoryId || "",
      subcategoryId: p.subcategoryId || "",
      price: p.price,
      priceStr: p.priceStr,
      description: p.description,
      image: p.image,
      images: p.images ?? [],
      colors: p.colors,
      colorNames: p.colorNames,
      sizes: p.sizes ?? [],
      isNew: p.isNew,
      displayLocations: p.displayLocations || [],
      badges: p.badges || [],
    });
    setPriceInput(String(p.price));
    setBadgeInput(p.badges?.join(", ") || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      alert("Please select a primary category before saving.");
      return;
    }

    // Sync legacy category string to matched category name
    const selectedCat = categories.find(c => c.id === form.categoryId);
    const updatedForm = {
      ...form,
      category: selectedCat ? selectedCat.name : "Uncategorized",
      badges: badgeInput.split(",").map(s => s.trim()).filter(Boolean)
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...updatedForm });
    } else {
      const newProduct: Product = {
        ...updatedForm,
        id: `prod_${Date.now()}`,
        images: updatedForm.images?.length ? updatedForm.images : [updatedForm.image],
      };
      addProduct(newProduct);
    }
    closeModal();
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Bulk Handlers
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const applyBulkCategory = () => {
    if (!bulkCategoryId) return;
    const selectedCat = categories.find(c => c.id === bulkCategoryId);
    const catName = selectedCat?.name || "Uncategorized";

    products.forEach(p => {
      if (selectedIds.has(p.id)) {
        updateProduct({ ...p, categoryId: bulkCategoryId, category: catName, subcategoryId: "" });
      }
    });
    setIsBulkCategoryModalOpen(false);
    setSelectedIds(new Set());
    alert(`Successfully moved ${selectedIds.size} products to ${catName}.`);
  };

  const bulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} products?`)) {
      products.forEach(p => {
        if (selectedIds.has(p.id)) {
          deleteProduct(p.id);
        }
      });
      setSelectedIds(new Set());
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(
    (p) => {
      const matchesSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "" || p.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    }
  );

  // Derive Subcategories for active form
  const activeFormCategory = categories.find(c => c.id === form.categoryId);
  const activeSubcategories = activeFormCategory?.subcategories || [];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Products</h1>
          <p className="text-gray-400 text-sm">
            Manage your inventory, categorical placements, and badges.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </header>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 flex items-center justify-between">
          <span className="text-orange-500 font-medium text-sm ml-2">
            {selectedIds.size} product{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsBulkCategoryModalOpen(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors border border-gray-700"
            >
              Move to Category
            </button>
            <button 
              onClick={bulkDelete}
              className="bg-red-500/10 text-red-500 px-4 py-2 rounded text-sm hover:bg-red-500/20 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Table card */}
      <div className="bg-black border border-gray-900 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-900 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 w-full max-w-2xl">
            <div className="relative w-full max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-900/50 border border-gray-800 rounded-md pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500"
              />
            </div>
            <div className="relative w-full max-w-xs">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-md pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium shrink-0">
            {filteredProducts.length} Products
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/30 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-900">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded bg-gray-900 border-gray-800 accent-orange-500" 
                  />
                </th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Placement</th>
                <th className="px-6 py-4 font-medium">Badges</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-sm">
              {filteredProducts.map((product) => {
                const pCategory = categories.find(c => c.id === product.categoryId);
                const pSubcat = pCategory?.subcategories?.find(s => s.id === product.subcategoryId);

                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${selectedIds.has(product.id) ? 'bg-orange-500/5' : 'hover:bg-zinc-950'}`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelection(product.id)}
                        className="w-4 h-4 rounded bg-gray-900 border-gray-800 accent-orange-500" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="relative w-10 shrink-0 bg-gray-900 border border-gray-800 overflow-hidden"
                          style={{ aspectRatio: "3/4", position: "relative" }}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                            {product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-orange-400 font-medium text-xs">{pCategory ? pCategory.name : product.category}</p>
                      {pSubcat && <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">{pSubcat.name}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isNew && <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">New</span>}
                        {product.badges?.map(b => (
                          <span key={b} className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">{b}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {product.priceStr}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-gray-600 text-sm"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Product Edit Modal ─────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.82)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-zinc-950 border border-gray-800 w-full max-w-4xl shadow-2xl mb-10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <h2 className="text-xl font-serif text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
              {/* Left Column (Main Details) */}
              <div className="flex-1 p-6 space-y-6 border-r border-gray-800">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Product Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Price (EGP) *</label>
                    <input
                      required
                      type="number"
                      min={1}
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Sizes (comma separated)</label>
                    <input
                      type="text"
                      value={form.sizes?.join(", ")}
                      onChange={(e) => set("sizes", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                      className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none rounded-md"
                  />
                </div>

                <div className="space-y-3 pt-4">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Image URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                    className="w-full bg-black border border-gray-800 text-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 rounded-md"
                  />
                </div>
              </div>

              {/* Right Column (Placement & Metadata) */}
              <div className="w-full md:w-80 p-6 space-y-8 bg-gray-900/20">
                {/* Categorization */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings2 size={16} className="text-orange-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Placement</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-medium">Primary Category *</label>
                    <select
                      required
                      value={form.categoryId}
                      onChange={(e) => set("categoryId", e.target.value)}
                      className="w-full bg-black border border-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-orange-500 rounded"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  {activeSubcategories.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 font-medium">Subcategory</label>
                      <select
                        value={form.subcategoryId}
                        onChange={(e) => set("subcategoryId", e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-orange-500 rounded"
                      >
                        <option value="">-- None --</option>
                        {activeSubcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Display Locations</label>
                    {DISPLAY_LOCATIONS.map(loc => (
                      <label key={loc.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={form.displayLocations?.includes(loc.id)}
                          onChange={(e) => {
                            const newLocs = new Set(form.displayLocations || []);
                            if (e.target.checked) newLocs.add(loc.id);
                            else newLocs.delete(loc.id);
                            set("displayLocations", Array.from(newLocs));
                          }}
                          className="w-3.5 h-3.5 rounded bg-black border-gray-800 accent-orange-500"
                        />
                        <span className="text-xs text-gray-400">{loc.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags & Badges */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={16} className="text-orange-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Badges</h3>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(e) => set("isNew", e.target.checked)}
                      className="w-4 h-4 rounded bg-black border-gray-800 accent-orange-500"
                    />
                    <span className="text-sm text-gray-300">Mark as New Arrival</span>
                  </label>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-medium">Custom Badges (comma separated)</label>
                    <input
                      type="text"
                      value={badgeInput}
                      onChange={(e) => setBadgeInput(e.target.value)}
                      placeholder="e.g. Best Seller, Sustainable"
                      className="w-full bg-black border border-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-orange-500 rounded"
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white px-4 py-3 text-sm uppercase tracking-widest font-medium hover:bg-orange-600 transition-colors rounded-md shadow-md"
                  >
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Category Assignment Modal */}
      {isBulkCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-zinc-950 border border-gray-800 w-full max-w-sm rounded-xl overflow-hidden p-6">
            <h3 className="text-lg font-serif text-white mb-4">Bulk Category Assign</h3>
            <p className="text-sm text-gray-400 mb-4">Select the destination category for {selectedIds.size} products.</p>
            <select
              value={bulkCategoryId}
              onChange={(e) => setBulkCategoryId(e.target.value)}
              className="w-full bg-black border border-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-orange-500 rounded mb-6"
            >
              <option value="">-- Select Category --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsBulkCategoryModalOpen(false)}
                className="text-gray-400 hover:text-white px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={applyBulkCategory}
                disabled={!bulkCategoryId}
                className="bg-orange-500 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
