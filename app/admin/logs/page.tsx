"use client";

import { useStore, ActivityLog } from "@/components/StoreContext";
import { useState } from "react";
import { ClipboardList, Trash2, Search, Package, ShoppingCart, Star, Settings, Users, Zap } from "lucide-react";

const CATEGORY_CONFIG: Record<ActivityLog['category'], { label: string; color: string; icon: React.ReactNode }> = {
  product:  { label: "Product",  color: "bg-blue-500/15 text-blue-400 border-blue-500/20",   icon: <Package size={12} /> },
  order:    { label: "Order",    color: "bg-green-500/15 text-green-400 border-green-500/20", icon: <ShoppingCart size={12} /> },
  review:   { label: "Review",   color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", icon: <Star size={12} /> },
  settings: { label: "Settings", color: "bg-orange-500/15 text-orange-400 border-orange-500/20", icon: <Settings size={12} /> },
  user:     { label: "User",     color: "bg-purple-500/15 text-purple-400 border-purple-500/20", icon: <Users size={12} /> },
  system:   { label: "System",   color: "bg-gray-500/15 text-gray-400 border-gray-500/20",   icon: <Zap size={12} /> },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ActivityLogsPage() {
  const { activityLogs, clearLogs, adminUser } = useStore();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<ActivityLog['category'] | "">("");

  const filtered = activityLogs.filter(log => {
    const matchSearch = search === "" || log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "" || log.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Activity Logs</h1>
          <p className="text-gray-400 text-sm">A full audit trail of every admin action performed on this dashboard.</p>
        </div>
        {adminUser?.role === "SuperAdmin" && activityLogs.length > 0 && (
          <button
            onClick={() => { if (confirm("Clear all activity logs? This cannot be undone.")) clearLogs(); }}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-md text-sm font-medium hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={16} /> Clear All Logs
          </button>
        )}
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search actions or users..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-md pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-gray-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value as any)}
          className="bg-gray-900/50 border border-gray-800 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Categories</option>
          {(Object.keys(CATEGORY_CONFIG) as ActivityLog['category'][]).map(cat => (
            <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>
          ))}
        </select>
        <span className="self-center text-gray-500 text-sm shrink-0">{filtered.length} entries</span>
      </div>

      {/* Log Table */}
      <div className="bg-black border border-gray-900 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-600">
            <ClipboardList size={48} className="mb-4 opacity-30" />
            <p className="font-serif text-lg">No logs found</p>
            <p className="text-sm mt-1">Actions performed in the admin panel will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/40 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-900">
              <tr>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {filtered.map(log => {
                const cfg = CATEGORY_CONFIG[log.category];
                return (
                  <tr key={log.id} className="hover:bg-zinc-950 transition-colors">
                    <td className="px-6 py-3 text-gray-200 font-medium">{log.action}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400">{log.user}</td>
                    <td className="px-6 py-3 text-gray-500 text-right font-mono text-xs">{formatTime(log.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
