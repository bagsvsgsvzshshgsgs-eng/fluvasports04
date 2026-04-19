"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useStore } from "@/components/StoreContext";
import { Product } from "@/lib/data";

const CATEGORIES = [
  "Bikinis",
  "One Pieces",
  "Kaftans",
  "Resortwear",
  "Cover-Ups",
  "Sarongs",
  "Rash Guards",
  "Swim Shorts",
  "Kids Swimwear",
  "Towels",
  "Swim Caps",
  "Sunglasses",
  "Goggles",
  "Hats",
  "Flip Flops",
  "Beach Bags",
  "Waterproof Bags",
  "Floaties",
  "Pool Rings",
  "Arm Bands",
  "Sunscreen",
  "Water Bottles",
  "Pool Accessories",
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
  category: "Bikinis",
  price: 0,
  priceStr: "",
  description: "",
  image: "/images/product_bestseller_1_1776081629759.png",
  images: [],
  colors: ["bg-stone-900"],
  colorNames: ["Noir"],
  sizes: ["XS", "S", "M", "L", "XL"],
  isNew: true,
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_FORM);
  const [priceInput, setPriceInput] = useState("");

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
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      priceStr: p.priceStr,
      description: p.description,
      image: p.image,
      images: p.images ?? [],
      colors: p.colors,
      colorNames: p.colorNames,
      sizes: p.sizes ?? [],
      isNew: p.isNew,
    });
    setPriceInput(String(p.price));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...form });
    } else {
      const newProduct: Product = {
        ...form,
        id: `prod_${Date.now()}`,
        images: form.images?.length ? form.images : [form.image],
      };
      addProduct(newProduct);
    }
    closeModal();
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const filteredProducts = products.filter(
    (p) =>
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Products</h1>
          <p className="text-gray-400 text-sm">
            Manage your inventory, prices, and product details.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-orange-500 text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-orange-600 transition-colors shadow-md"
        >
          + Add Product
        </button>
      </header>

      {/* Table card */}
      <div className="bg-black border border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="bg-black border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-64 text-white placeholder-gray-700"
          />
          <p className="text-gray-400 text-sm">
            {filteredProducts.length} / {products.length} Products
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black text-gray-400 text-xs uppercase tracking-widest border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-sm">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-zinc-950 transition-colors"
                >
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
                        <p className="text-xs text-gray-600">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-white">
                    {product.priceStr}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.isNew ? "bg-orange-400" : "bg-green-500"
                        }`}
                      />
                      <span className="text-gray-400 text-xs uppercase tracking-widest">
                        {product.isNew ? "New" : "Active"}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-gray-500 hover:text-white font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${product.name}"?`))
                          deleteProduct(product.id);
                      }}
                      className="text-gray-600 hover:text-red-500 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
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

      {/* ── Modal ─────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.82)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-zinc-950 border border-gray-800 w-full max-w-2xl shadow-2xl mb-10">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-serif text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                    Product Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="e.g. The Monaco Bikini"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                    Price (EGP) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      EGP
                    </span>
                    <input
                      required
                      type="number"
                      min={1}
                      step={1}
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="w-full bg-black border border-gray-800 text-white pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                    Sizes{" "}
                    <span className="text-gray-600 normal-case tracking-normal">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.sizes?.join(", ")}
                    onChange={(e) =>
                      set(
                        "sizes",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="XS, S, M, L, XL"
                  />
                </div>
              </div>

              {/* Image picker */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                  Product Image *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_IMAGES.map((img) => (
                    <button
                      key={img.value}
                      type="button"
                      onClick={() => set("image", img.value)}
                      className="relative overflow-hidden border-2 transition-all duration-200"
                      style={{
                        aspectRatio: "3/4",
                        position: "relative",
                        borderColor:
                          form.image === img.value
                            ? "#f97316"
                            : "transparent",
                      }}
                    >
                      <Image
                        src={img.value}
                        alt={img.label}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                      {form.image === img.value && (
                        <div className="absolute inset-0 bg-orange-500/20 flex items-end pb-1 justify-center">
                          <span className="text-[9px] uppercase tracking-widest text-white font-bold bg-orange-500 px-2 py-0.5">
                            Selected
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    Or paste a custom image URL:
                  </p>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                    className="w-full bg-black border border-gray-800 text-gray-300 px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-orange-500"
                    placeholder="/images/..."
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                    Color Classes{" "}
                    <span className="text-gray-600 normal-case tracking-normal">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.colors.join(", ")}
                    onChange={(e) =>
                      set(
                        "colors",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="bg-stone-900, bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                    Color Names{" "}
                    <span className="text-gray-600 normal-case tracking-normal">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.colorNames.join(", ")}
                    onChange={(e) =>
                      set(
                        "colorNames",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="Noir, Blanc"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full bg-black border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Describe the product…"
                />
              </div>

              {/* New Arrival toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => set("isNew", !form.isNew)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                    form.isNew ? "bg-orange-500" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                      form.isNew ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-300">
                  Mark as{" "}
                  <span className="text-orange-400 font-medium">
                    New Arrival
                  </span>
                </span>
              </label>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-800 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-3 text-sm uppercase tracking-widest font-medium text-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-orange-600 transition-colors shadow-md"
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
