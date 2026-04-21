"use client";

import { useStore } from "@/components/StoreContext";
import { useState, useRef } from "react";
import { UploadCloud, Trash2, Copy, CheckCircle2, Image as ImageIcon } from "lucide-react";

export default function MediaLibrary() {
  const { settings, updateSettings } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        updateSettings({
          mediaLibrary: [data.url, ...(settings.mediaLibrary || [])]
        });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteMedia = (url: string) => {
    if (confirm("Are you sure you want to remove this image from the library?")) {
      updateSettings({
        mediaLibrary: settings.mediaLibrary.filter(img => img !== url)
      });
    }
  };

  const allMedia = settings.mediaLibrary || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Media Library</h1>
          <p className="text-gray-400 text-sm">Upload and manage images used across your store.</p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <UploadCloud size={18} />
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      {allMedia.length === 0 ? (
        <div className="bg-black border border-gray-900 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-500">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-lg font-serif text-white mb-2">No media found</h3>
          <p className="text-gray-400 text-sm max-w-sm">Upload images to use in banners, products, and promotional sections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {allMedia.map((url, idx) => (
            <div key={idx} className="bg-black border border-gray-900 rounded-xl overflow-hidden group">
              <div className="relative aspect-square bg-gray-900">
                <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => copyToClipboard(url)}
                    className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === url ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                  <button 
                    onClick={() => deleteMedia(url)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-3 border-t border-gray-900">
                <p className="text-xs text-gray-500 truncate" title={url}>{url.split('/').pop()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
