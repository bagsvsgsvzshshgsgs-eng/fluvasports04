"use client";

import { useStore, HeroBanner } from "@/components/StoreContext";
import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, GripVertical, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableBannerItem({ banner, onEdit, onDelete, onToggle }: { banner: HeroBanner, onEdit: (b: HeroBanner) => void, onDelete: (id: string) => void, onToggle: (id: string, active: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-black border ${isDragging ? 'border-orange-500 shadow-xl' : 'border-gray-900'} rounded-xl p-4 flex items-center gap-4 group`}>
      <div {...attributes} {...listeners} className="cursor-grab text-gray-600 hover:text-white p-2">
        <GripVertical size={20} />
      </div>
      <div className="w-24 h-16 bg-gray-900 rounded-md overflow-hidden shrink-0">
        {banner.image ? (
          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={20} /></div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium text-sm mb-1">{banner.title || "Untitled Banner"}</h3>
        <p className="text-gray-500 text-xs truncate max-w-md">{banner.subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onToggle(banner.id, banner.isActive)} className={`p-2 rounded-md ${banner.isActive ? 'text-green-500 bg-green-500/10' : 'text-gray-500 bg-gray-900'}`}>
          {banner.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button onClick={() => onEdit(banner)} className="p-2 text-orange-500 bg-orange-500/10 rounded-md hover:bg-orange-500/20">
          <Edit2 size={16} />
        </button>
        <button onClick={() => onDelete(banner.id)} className="p-2 text-red-500 bg-red-500/10 rounded-md hover:bg-red-500/20">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function BannersAdmin() {
  const { settings, updateSettings } = useStore();
  const banners = settings.heroBanners || [];
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HeroBanner>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = banners.findIndex((b) => b.id === active.id);
      const newIndex = banners.findIndex((b) => b.id === over.id);
      
      const newOrder = arrayMove(banners, oldIndex, newIndex);
      const updatedBanners = newOrder.map((b, index) => ({ ...b, order: index }));
      updateSettings({ heroBanners: updatedBanners });
    }
  };

  const handleEdit = (banner: HeroBanner) => {
    setEditingId(banner.id);
    setFormData(banner);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      updateSettings({ heroBanners: banners.filter(b => b.id !== id) });
      if (editingId === id) setEditingId(null);
    }
  };

  const handleToggleActive = (id: string, current: boolean) => {
    updateSettings({ heroBanners: banners.map(b => b.id === id ? { ...b, isActive: !current } : b) });
  };

  const handleAddNew = () => {
    const newBanner: HeroBanner = {
      id: `banner_${Date.now()}`,
      title: "New Banner",
      subtitle: "",
      image: "",
      link: "/shop",
      isActive: false,
      order: banners.length
    };
    updateSettings({ heroBanners: [...banners, newBanner] });
    handleEdit(newBanner);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateSettings({
      heroBanners: banners.map(b => b.id === editingId ? { ...b, ...formData } as HeroBanner : b)
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Homepage Banners</h1>
          <p className="text-gray-400 text-sm">Manage and reorder the rotating hero banners on your storefront.</p>
        </div>
        <button onClick={handleAddNew} className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={banners.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {banners.map(banner => (
                <SortableBannerItem 
                  key={banner.id} 
                  banner={banner} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                  onToggle={handleToggleActive}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {banners.length === 0 && (
            <div className="p-12 border border-dashed border-gray-900 rounded-xl text-center">
              <p className="text-gray-500">No banners found. Create one to get started.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {editingId ? (
            <div className="bg-black border border-gray-900 rounded-xl p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif text-white">Edit Banner</h3>
                <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Heading</label>
                  <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Subheading</label>
                  <textarea value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none h-24" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                  <input type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none" placeholder="/images/banner.jpg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Link Destination</label>
                  <input type="text" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 focus:border-orange-500 outline-none" placeholder="/shop" />
                </div>
                <button onClick={handleSave} className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 mt-4">
                  <Save size={16} /> Save Banner
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/30 border border-gray-900 rounded-xl p-8 flex flex-col items-center justify-center text-center h-64 sticky top-24">
              <ImageIcon size={32} className="text-gray-600 mb-4" />
              <p className="text-gray-500 text-sm">Select a banner to edit its content or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
