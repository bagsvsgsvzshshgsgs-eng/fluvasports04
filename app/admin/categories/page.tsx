"use client";

import { useStore } from "@/components/StoreContext";
import { useState } from "react";
import { 
  Save, Plus, Trash2, GripVertical, Image as ImageIcon, 
  Settings, Link as LinkIcon, Search, Type, Calendar, Percent
} from "lucide-react";
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from "next/link";
import { Category, SubCategory, Bundle, SaleSchedule } from "@/components/StoreContext";

// Sortable Category Item Component
function SortableCategoryItem({ category, isActive, onClick }: { category: Category, isActive: boolean, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
        isActive ? 'bg-gray-900 border-orange-500/50' : 'bg-black border-gray-800 hover:border-gray-700'
      }`}
      onClick={onClick}
    >
      <div {...attributes} {...listeners} className="text-gray-500 hover:text-white cursor-grab active:cursor-grabbing p-1">
        <GripVertical size={16} />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium text-white truncate">{category.name}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{category.type || 'Standard'}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-green-500' : 'bg-gray-700'}`} />
    </div>
  );
}

export default function CategoryManagement() {
  const { settings, updateSettings, products } = useStore();
  const categories = settings.categories || [];
  
  const [activeTab, setActiveTab] = useState<'general'|'media'|'seo'|'structure'|'specials'>('general');
  const [selectedId, setSelectedId] = useState<string | null>(categories[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const newCategories = arrayMove(categories, oldIndex, newIndex).map((c, i) => ({ ...c, order: i }));
      updateSettings({ categories: newCategories });
    }
  };

  const selectedCategory = categories.find(c => c.id === selectedId) || null;

  const updateCategory = (id: string, data: Partial<Category>) => {
    updateSettings({
      categories: categories.map(c => c.id === id ? { ...c, ...data } : c)
    });
  };

  const addCategory = () => {
    const newId = `cat_${Date.now()}`;
    updateSettings({
      categories: [...categories, {
        id: newId,
        name: "New Category",
        slug: `new-category-${Date.now()}`,
        image: "",
        banner: "",
        seoTitle: "",
        seoDescription: "",
        isActive: false,
        showOnHomepage: false,
        order: categories.length,
        featuredProductIds: [],
        subcategories: [],
        type: 'Standard'
      }]
    });
    setSelectedId(newId);
  };

  const deleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const newCats = categories.filter(c => c.id !== id);
      updateSettings({ categories: newCats });
      if (selectedId === id) setSelectedId(newCats[0]?.id || null);
    }
  };

  const addSubcategory = () => {
    if (!selectedCategory) return;
    const newSub: SubCategory = {
      id: `sub_${Date.now()}`,
      name: "New Subcategory",
      slug: `${selectedCategory.slug}/new-sub`
    };
    updateCategory(selectedCategory.id, {
      subcategories: [...(selectedCategory.subcategories || []), newSub]
    });
  };

  const updateSubcategory = (subId: string, data: Partial<SubCategory>) => {
    if (!selectedCategory) return;
    updateCategory(selectedCategory.id, {
      subcategories: selectedCategory.subcategories.map(s => s.id === subId ? { ...s, ...data } : s)
    });
  };

  const removeSubcategory = (subId: string) => {
    if (!selectedCategory) return;
    updateCategory(selectedCategory.id, {
      subcategories: selectedCategory.subcategories.filter(s => s.id !== subId)
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Category Management</h1>
          <p className="text-gray-400 text-sm">Organize products, manage SEO, and configure dynamic bundles/sales.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/shop" target="_blank" className="bg-gray-900 text-white px-5 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 border border-gray-800 shadow-sm">
            <LinkIcon size={18} /> Preview Changes
          </Link>
          <button onClick={addCategory} className="bg-orange-500 text-white px-5 py-2.5 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={18} /> Add Category
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Category List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-black border border-gray-900 rounded-xl p-4 shadow-sm">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">Structure Hierarchy</h2>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <SortableCategoryItem 
                      key={category.id} 
                      category={category} 
                      isActive={selectedId === category.id}
                      onClick={() => setSelectedId(category.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Right Content: Category Detail */}
        <div className="lg:col-span-8">
          {selectedCategory ? (
            <div className="bg-black border border-gray-900 rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
              
              {/* Detail Header & Tabs */}
              <div className="border-b border-gray-900 bg-gray-900/20">
                <div className="p-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-serif text-white">{selectedCategory.name}</h2>
                    <p className="text-gray-500 text-sm mt-1 font-mono">/{selectedCategory.slug}</p>
                  </div>
                  <button 
                    onClick={() => deleteCategory(selectedCategory.id)}
                    className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex px-6 gap-6 overflow-x-auto custom-scrollbar">
                  {[
                    { id: 'general', label: 'General', icon: <Settings size={14}/> },
                    { id: 'media', label: 'Media', icon: <ImageIcon size={14}/> },
                    { id: 'seo', label: 'SEO', icon: <Search size={14}/> },
                    { id: 'structure', label: 'Structure', icon: <Type size={14}/> },
                    ...(selectedCategory.type !== 'Standard' ? [{ 
                      id: 'specials', 
                      label: selectedCategory.type === 'BundleDeals' ? 'Bundle Config' : 'Sale Config', 
                      icon: <Percent size={14}/> 
                    }] : [])
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                          ? 'text-orange-500 border-orange-500' 
                          : 'text-gray-500 border-transparent hover:text-gray-300'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail Content Area */}
              <div className="p-6 flex-1">
                
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Category Name</label>
                        <input 
                          type="text" 
                          value={selectedCategory.name}
                          onChange={(e) => updateCategory(selectedCategory.id, { name: e.target.value })}
                          className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Category Type</label>
                        <select
                          value={selectedCategory.type || 'Standard'}
                          onChange={(e) => updateCategory(selectedCategory.id, { type: e.target.value as any })}
                          className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Sale">Sale Collection</option>
                          <option value="BundleDeals">Bundle Deals</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">URL Slug</label>
                      <input 
                        type="text" 
                        value={selectedCategory.slug}
                        onChange={(e) => updateCategory(selectedCategory.id, { slug: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-800 text-gray-300 px-4 py-2.5 rounded-md font-mono text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-900 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCategory.isActive}
                          onChange={(e) => updateCategory(selectedCategory.id, { isActive: e.target.checked })}
                          className="w-4 h-4 accent-orange-500 bg-gray-900 border-gray-800 rounded"
                        />
                        <span className="text-sm text-gray-300">Category is Active (Visible to public)</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCategory.showOnHomepage}
                          onChange={(e) => updateCategory(selectedCategory.id, { showOnHomepage: e.target.checked })}
                          className="w-4 h-4 accent-orange-500 bg-gray-900 border-gray-800 rounded"
                        />
                        <span className="text-sm text-gray-300">Display prominently on Homepage Showcase</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* MEDIA TAB */}
                {activeTab === 'media' && (
                  <div className="space-y-8 max-w-2xl">
                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Category Display Image</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /images/category-cover.jpg"
                        value={selectedCategory.image}
                        onChange={(e) => updateCategory(selectedCategory.id, { image: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500 mb-4"
                      />
                      {selectedCategory.image && (
                        <div className="w-48 aspect-[3/4] bg-gray-900 rounded-md border border-gray-800 overflow-hidden relative">
                          <img src={selectedCategory.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-900">
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Hero Banner (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Wide banner image URL..."
                        value={selectedCategory.banner}
                        onChange={(e) => updateCategory(selectedCategory.id, { banner: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500 mb-4"
                      />
                      {selectedCategory.banner && (
                        <div className="w-full aspect-[21/9] bg-gray-900 rounded-md border border-gray-800 overflow-hidden relative">
                          <img src={selectedCategory.banner} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO TAB */}
                {activeTab === 'seo' && (
                  <div className="space-y-8 max-w-2xl">
                    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2 font-sans uppercase">Search Engine Preview</p>
                      <h3 className="text-blue-600 text-xl font-medium mb-1 truncate hover:underline cursor-pointer">{selectedCategory.seoTitle || selectedCategory.name} - Fluva Sport</h3>
                      <p className="text-green-700 text-sm mb-1">https://fluvasport.com/shop/{selectedCategory.slug}</p>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {selectedCategory.seoDescription || "Discover the latest luxury swimwear collections at Fluva Sport. Sustainable performance meets Mediterranean elegance."}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">SEO Title</label>
                        <input 
                          type="text" 
                          value={selectedCategory.seoTitle}
                          onChange={(e) => updateCategory(selectedCategory.id, { seoTitle: e.target.value })}
                          className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">SEO Description</label>
                        <textarea 
                          rows={4}
                          value={selectedCategory.seoDescription}
                          onChange={(e) => updateCategory(selectedCategory.id, { seoDescription: e.target.value })}
                          className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STRUCTURE TAB */}
                {activeTab === 'structure' && (
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Subcategories</label>
                        <button onClick={addSubcategory} className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1 font-medium">
                          <Plus size={14} /> Add Subcategory
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {selectedCategory.subcategories?.map((sub, idx) => (
                          <div key={sub.id} className="flex gap-4 items-start bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                            <div className="w-8 h-8 rounded bg-black border border-gray-700 flex items-center justify-center text-xs text-gray-500 font-mono shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input 
                                type="text" 
                                placeholder="Subcategory Name"
                                value={sub.name}
                                onChange={(e) => updateSubcategory(sub.id, { name: e.target.value })}
                                className="w-full bg-black border border-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:border-orange-500 text-sm"
                              />
                              <input 
                                type="text" 
                                placeholder="URL Slug"
                                value={sub.slug}
                                onChange={(e) => updateSubcategory(sub.id, { slug: e.target.value })}
                                className="w-full bg-black border border-gray-800 text-gray-300 px-3 py-2 rounded focus:outline-none focus:border-orange-500 font-mono text-sm"
                              />
                            </div>
                            <button onClick={() => removeSubcategory(sub.id)} className="text-gray-500 hover:text-red-500 p-2 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        {(!selectedCategory.subcategories || selectedCategory.subcategories.length === 0) && (
                          <p className="text-sm text-gray-500 italic p-4 text-center border border-dashed border-gray-800 rounded-lg">No subcategories defined.</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-900">
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 block">Featured Products (Max 4)</label>
                      <input 
                        type="text" 
                        placeholder="Comma separated product IDs (e.g. prod_1, prod_2)"
                        value={selectedCategory.featuredProductIds?.join(", ")}
                        onChange={(e) => updateCategory(selectedCategory.id, { 
                          featuredProductIds: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                        })}
                        className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500 font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-2">These products will be highlighted in the showcase and top of the category page.</p>
                    </div>
                  </div>
                )}

                {/* SPECIALS TAB */}
                {activeTab === 'specials' && selectedCategory.type === 'BundleDeals' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg flex items-start gap-3">
                      <Percent className="text-orange-500 mt-0.5 shrink-0" size={18} />
                      <div>
                        <h4 className="text-orange-500 font-medium text-sm">Bundle Deal Configuration</h4>
                        <p className="text-gray-400 text-xs mt-1">Configure products to be sold together as a discounted bundle.</p>
                      </div>
                    </div>
                    {/* Placeholder for complex Bundle configuration */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Bundle Discount Percentage</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            defaultValue={15}
                            className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Products in Bundle</label>
                        <textarea 
                          rows={3}
                          placeholder="prod_1, prod_2"
                          className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specials' && selectedCategory.type === 'Sale' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3">
                      <Calendar className="text-red-500 mt-0.5 shrink-0" size={18} />
                      <div>
                        <h4 className="text-red-500 font-medium text-sm">Sale Scheduling</h4>
                        <p className="text-gray-400 text-xs mt-1">Schedule automatic discounts for products in this category.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Start Date</label>
                        <input 
                          type="datetime-local" 
                          className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">End Date</label>
                        <input 
                          type="datetime-local" 
                          className="w-full bg-gray-900/50 border border-gray-800 text-white px-4 py-2.5 rounded-md focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="bg-black border border-gray-900 rounded-xl shadow-sm h-full min-h-[600px] flex items-center justify-center flex-col text-gray-500">
              <Type size={48} className="mb-4 opacity-20" />
              <p className="font-serif text-lg">Select a category</p>
              <p className="text-sm">Choose a category from the sidebar to edit its details.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
