"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Check, X, Star, ChevronDown, ChevronRight, GitFork, RefreshCw } from "lucide-react";

interface Category {
  id: string;
  name: string;
  isFeatured: boolean;
  parentId: string | null;
  children: Category[];
}

const LEVEL_CONFIG = [
  { label: "L1", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", desc: "Main Tab" },
  { label: "L2", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", desc: "Section" },
  { label: "L3", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", desc: "Sub-category" },
];

function countAll(nodes: Category[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countAll(n.children || []), 0);
}
function countFeatured(nodes: Category[]): number {
  return nodes.reduce((acc, n) => acc + (n.isFeatured ? 1 : 0) + countFeatured(n.children || []), 0);
}

function TreeNode({
  node,
  level,
  onAdd,
  onEdit,
  onDelete,
  onToggleFeatured,
  addingParentId,
  setAddingParentId,
  editingId,
  setEditingId,
  newName,
  setNewName,
  editName,
  setEditName,
}: {
  node: Category;
  level: number;
  onAdd: (parentId: string | null) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  addingParentId: string | null;
  setAddingParentId: (id: string | null) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  newName: string;
  setNewName: (n: string) => void;
  editName: string;
  setEditName: (n: string) => void;
}) {
  const [expanded, setExpanded] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;
  const lvl = LEVEL_CONFIG[Math.min(level, LEVEL_CONFIG.length - 1)];

  return (
    <li className="relative">
      {/* Node Row */}
      <div
        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${
          editingId === node.id
            ? "bg-gray-900 border-orange-500/50"
            : "bg-[#111111] border-gray-800 hover:border-gray-700 hover:bg-[#161616]"
        }`}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Expand toggle */}
          {hasChildren ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-white transition-colors shrink-0"
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-4 shrink-0" />
          )}

          {/* Level badge */}
          <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${lvl.color}`}>
            {lvl.label}
          </span>

          {/* Name / Edit input */}
          {editingId === node.id ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-black border border-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none focus:border-orange-500 flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEdit(node.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
              <button onClick={() => onEdit(node.id)} className="text-green-500 hover:text-green-400 p-1 shrink-0">
                <Check size={15} />
              </button>
              <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400 p-1 shrink-0">
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="font-medium text-white text-sm truncate">{node.name}</span>
              <span className="text-[9px] text-gray-600 hidden group-hover:inline uppercase tracking-widest shrink-0">
                {lvl.desc}
              </span>
              {node.isFeatured && (
                <span className="bg-orange-500/10 text-orange-400 text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-orange-500/20 shrink-0">
                  Featured
                </span>
              )}
              {hasChildren && (
                <span className="text-[9px] text-gray-600 shrink-0">
                  ({node.children.length})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {editingId !== node.id && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
            <button
              onClick={() => onToggleFeatured(node.id, node.isFeatured)}
              title={node.isFeatured ? "Unmark Featured" : "Mark as Featured"}
              className={`p-1.5 rounded-md transition-colors ${
                node.isFeatured
                  ? "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20"
                  : "text-gray-600 hover:text-orange-400 hover:bg-orange-500/10"
              }`}
            >
              <Star size={14} className={node.isFeatured ? "fill-current" : ""} />
            </button>

            <button
              onClick={() => {
                setEditingId(node.id);
                setEditName(node.name);
              }}
              title="Edit label"
              className="p-1.5 text-gray-600 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            >
              <Edit2 size={14} />
            </button>

            <button
              onClick={() => {
                setAddingParentId(node.id);
                setNewName("");
              }}
              title="Add sub-category"
              className="p-1.5 text-gray-600 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
            >
              <Plus size={14} />
            </button>

            <button
              onClick={() => onDelete(node.id)}
              title="Delete"
              className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Inline add input for this node */}
      {addingParentId === node.id && (
        <div className={`mt-2 ${level > 0 ? "ml-8" : "ml-6"}`}>
          <div className="flex items-center gap-2 p-3 bg-[#111] border border-gray-800 border-l-2 border-l-orange-500 rounded-lg">
            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${LEVEL_CONFIG[Math.min(level + 1, LEVEL_CONFIG.length - 1)].color}`}>
              {LEVEL_CONFIG[Math.min(level + 1, LEVEL_CONFIG.length - 1)].label}
            </span>
            <input
              type="text"
              placeholder={`New ${LEVEL_CONFIG[Math.min(level + 1, LEVEL_CONFIG.length - 1)].desc.toLowerCase()} name...`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-black border border-gray-700 text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:border-orange-500 flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onAdd(node.id);
                if (e.key === "Escape") setAddingParentId(null);
              }}
            />
            <button
              onClick={() => onAdd(node.id)}
              className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Add
            </button>
            <button onClick={() => setAddingParentId(null)} className="text-gray-500 hover:text-white p-1">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <ul className="mt-2 ml-6 space-y-2 border-l border-gray-800/60 pl-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFeatured={onToggleFeatured}
              addingParentId={addingParentId}
              setAddingParentId={setAddingParentId}
              editingId={editingId}
              setEditingId={setEditingId}
              newName={newName}
              setNewName={setNewName}
              editName={editName}
              setEditName={setEditName}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoryTreeManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [addingParentId, setAddingParentId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (parentId: string | null) => {
    if (!newName.trim()) return;
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), parentId }),
      });
      setNewName("");
      setAddingParentId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      fetchCategories();
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category and all its subcategories?")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const total = countAll(categories);
  const featured = countFeatured(categories);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GitFork size={24} className="text-orange-500" />
            <h1 className="text-3xl font-serif text-white">Category Tree</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Manage your website's recursive navigation hierarchy. Changes are reflected across the mega-menu instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCategories(true)}
            disabled={refreshing}
            className="bg-gray-900 text-gray-400 hover:text-white border border-gray-800 px-4 py-2.5 rounded-md transition-colors flex items-center gap-2 text-sm"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => { setAddingParentId("root"); setNewName(""); }}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm text-sm"
          >
            <Plus size={16} /> Add Root Category
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Nodes", value: total, color: "text-white" },
          { label: "Root (L1)", value: categories.length, color: "text-blue-400" },
          { label: "Featured", value: featured, color: "text-orange-400" },
          { label: "Depth Levels", value: Math.min(3, total > 0 ? 3 : 0), color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-black border border-gray-900 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-serif font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-500">
        <span className="font-medium text-gray-400 uppercase tracking-widest">Levels:</span>
        {LEVEL_CONFIG.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${l.color}`}>
              {l.label}
            </span>
            {l.desc}
          </span>
        ))}
      </div>

      {/* Tree panel */}
      <div className="bg-black border border-gray-900 rounded-xl p-6 shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500 text-sm animate-pulse">
            Loading category tree...
          </div>
        ) : (
          <div className="max-w-4xl space-y-3">
            {/* Root-level add input */}
            {addingParentId === "root" && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-[#111] border border-gray-800 border-l-2 border-l-blue-500 rounded-lg">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${LEVEL_CONFIG[0].color}`}>
                  L1
                </span>
                <input
                  type="text"
                  placeholder="New root category name (e.g. Women, Men)..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-black border border-gray-700 text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:border-orange-500 flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd(null);
                    if (e.key === "Escape") setAddingParentId(null);
                  }}
                />
                <button
                  onClick={() => handleAdd(null)}
                  className="bg-orange-500 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
                <button onClick={() => setAddingParentId(null)} className="text-gray-500 hover:text-white p-1">
                  <X size={16} />
                </button>
              </div>
            )}

            {categories.length === 0 ? (
              <div className="text-center py-16 text-gray-500 border border-dashed border-gray-800 rounded-xl">
                <GitFork size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-serif">No categories yet.</p>
                <p className="text-sm mt-1">Click "Add Root Category" to get started.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {categories.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleFeatured={handleToggleFeatured}
                    addingParentId={addingParentId}
                    setAddingParentId={setAddingParentId}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    newName={newName}
                    setNewName={setNewName}
                    editName={editName}
                    setEditName={setEditName}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
