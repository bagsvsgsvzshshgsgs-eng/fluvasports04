"use client";

import { useState } from "react";
import { useStore } from "@/components/StoreContext";

// ── Small colour swatch you can click to change ──────────────────────────────
const ACCENT_PRESETS = [
  "#c8a96e", // gold
  "#e07b4a", // orange
  "#9ba89c", // sage
  "#a87c8a", // rose
  "#6e8fa8", // steel blue
  "#e8dcc4", // sand
  "#ffffff", // white
];

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap mt-2">
      {ACCENT_PRESETS.map((c) => (
        <button
          key={c}
          type="button"
          title={c}
          onClick={() => onChange(c)}
          className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
          style={{
            backgroundColor: c,
            borderColor: value === c ? "#ff8c42" : "transparent",
            outline: value === c ? "2px solid #ff8c42" : "none",
          }}
        />
      ))}
      {/* Custom hex input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={7}
        className="w-20 border border-gray-800 bg-black text-gray-300 px-2 py-1 text-xs font-mono focus:outline-none focus:border-orange-500"
        placeholder="#hex"
      />
    </div>
  );
}

// ── Product toggle chip ───────────────────────────────────────────────────────
function ProductChip({
  product,
  selected,
  accentColor,
  onToggle,
}: {
  product: { id: string; name: string; priceStr: string; category: string };
  selected: boolean;
  accentColor: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 text-left border transition-all duration-200 w-full text-xs"
      style={{
        borderColor: selected ? accentColor : "#374151",
        backgroundColor: selected ? `${accentColor}18` : "transparent",
        color: selected ? "#fff" : "#9ca3af",
      }}
    >
      <span
        className="shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold"
        style={{
          borderColor: selected ? accentColor : "#6b7280",
          backgroundColor: selected ? accentColor : "transparent",
          color: selected ? "#000" : "transparent",
        }}
      >
        ✓
      </span>
      <span className="flex-1 truncate font-medium">{product.name}</span>
      <span className="shrink-0 text-gray-500">{product.priceStr}</span>
    </button>
  );
}

// ── Single collection editor ──────────────────────────────────────────────────
function ShowcaseEditor({
  collectionIndex,
}: {
  collectionIndex: number;
}) {
  const { settings, updateSettings, products } = useStore();
  const collection = settings.categoryShowcase[collectionIndex];

  const [search, setSearch] = useState("");

  const updateCollection = (
    patch: Partial<(typeof settings.categoryShowcase)[0]>
  ) => {
    const updated = settings.categoryShowcase.map((c, i) =>
      i === collectionIndex ? { ...c, ...patch } : c
    );
    updateSettings({ categoryShowcase: updated });
  };

  const toggleProduct = (productId: string) => {
    const cur = collection.productIds;
    const next = cur.includes(productId)
      ? cur.filter((id) => id !== productId)
      : [...cur, productId];
    updateCollection({ productIds: next });
  };

  const moveUp = (productId: string) => {
    const cur = [...collection.productIds];
    const idx = cur.indexOf(productId);
    if (idx <= 0) return;
    [cur[idx - 1], cur[idx]] = [cur[idx], cur[idx - 1]];
    updateCollection({ productIds: cur });
  };

  const moveDown = (productId: string) => {
    const cur = [...collection.productIds];
    const idx = cur.indexOf(productId);
    if (idx === -1 || idx >= cur.length - 1) return;
    [cur[idx], cur[idx + 1]] = [cur[idx + 1], cur[idx]];
    updateCollection({ productIds: cur });
  };

  const filteredProducts = products.filter(
    (p) =>
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="bg-black border shadow-sm"
      style={{ borderColor: `${collection.accentColor}40` }}
    >
      {/* Card header */}
      <div
        className="p-5 border-b flex items-center gap-4"
        style={{ borderColor: `${collection.accentColor}30` }}
      >
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: collection.accentColor }}
        />
        <h3 className="font-serif text-white text-lg flex-1">
          {collection.title}
        </h3>
        <span className="text-xs text-gray-500 uppercase tracking-widest">
          {collection.productIds.length} products
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Title & Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              Section Title
            </label>
            <input
              type="text"
              value={collection.title}
              onChange={(e) => updateCollection({ title: e.target.value })}
              className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 bg-black text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              Subtitle Tag
            </label>
            <input
              type="text"
              value={collection.subtitle}
              onChange={(e) => updateCollection({ subtitle: e.target.value })}
              className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 bg-black text-white"
            />
          </div>
        </div>

        {/* Link & Accent Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              "Shop All" Link
            </label>
            <input
              type="text"
              value={collection.link}
              onChange={(e) => updateCollection({ link: e.target.value })}
              className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 bg-black text-gray-300 font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              Accent Color
            </label>
            <ColorPicker
              value={collection.accentColor}
              onChange={(v) => updateCollection({ accentColor: v })}
            />
          </div>
        </div>

        {/* Product order (selected) */}
        {collection.productIds.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              Product Order{" "}
              <span className="text-gray-600 normal-case tracking-normal">
                — first product becomes the hero card
              </span>
            </label>
            <div className="space-y-1">
              {collection.productIds.map((pid, idx) => {
                const p = products.find((x) => x.id === pid);
                if (!p) return null;
                return (
                  <div
                    key={pid}
                    className="flex items-center gap-2 px-3 py-2 border"
                    style={{ borderColor: `${collection.accentColor}30` }}
                  >
                    <span
                      className="text-[10px] font-bold w-5 text-center shrink-0"
                      style={{ color: collection.accentColor }}
                    >
                      {idx === 0 ? "★" : idx + 1}
                    </span>
                    <span className="flex-1 text-xs text-white font-medium truncate">
                      {p.name}
                    </span>
                    <span className="text-xs text-gray-500 shrink-0">
                      {p.priceStr}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveUp(pid)}
                        disabled={idx === 0}
                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(pid)}
                        disabled={idx === collection.productIds.length - 1}
                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleProduct(pid)}
                        className="w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-400 transition-colors text-xs"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Product picker */}
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">
            Add / Remove Products
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category…"
            className="w-full border border-gray-800 px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-black text-gray-300 placeholder-gray-700"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-64 overflow-y-auto pr-1">
            {filteredProducts.map((p) => (
              <ProductChip
                key={p.id}
                product={p}
                selected={collection.productIds.includes(p.id)}
                accentColor={collection.accentColor}
                onToggle={() => toggleProduct(p.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminCategoryShowcase() {
  const { settings } = useStore();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-serif text-white mb-1">
          Category Showcase
        </h1>
        <p className="text-gray-400 text-sm">
          Configure the three collection sections on the homepage. Pick
          products, set their order, and customise the accent colour for each
          collection. Changes save instantly.
        </p>
      </header>

      {/* Live preview hint */}
      <div className="flex items-start gap-3 border border-orange-500/20 bg-orange-500/5 px-5 py-4">
        <span className="text-orange-400 text-base shrink-0 mt-0.5">✦</span>
        <p className="text-sm text-orange-200/70 leading-relaxed">
          Changes are applied <strong className="text-orange-300">live</strong>{" "}
          — open the homepage in another tab to preview in real time.
          The first product in each collection becomes the large{" "}
          <strong className="text-orange-300">hero card</strong>.
        </p>
      </div>

      <div className="space-y-8">
        {settings.categoryShowcase.map((_, i) => (
          <ShowcaseEditor key={i} collectionIndex={i} />
        ))}
      </div>
    </div>
  );
}
