"use client";

import { useStore } from "@/components/StoreContext";
import { Search, Filter, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminOrders() {
  const { orders, updateOrderStatus, refreshData } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "Shipped": return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Delivered": return "bg-green-500/10 text-green-500 border border-green-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-500 border border-red-500/20";
      default: return "bg-gray-900 text-gray-500 border border-gray-800";
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Orders</h1>
          <p className="text-gray-400 text-sm">Manage customer orders and fulfillment status.</p>
        </div>
        <button 
          onClick={handleManualRefresh}
          className="flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <div className="bg-black border border-gray-900 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-1 w-full gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by ID, name, or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-md pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors" 
              />
            </div>
            <div className="relative w-40">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-md pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer transition-colors"
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">{filteredOrders.length} Orders</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/30 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-900">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-light italic">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-900/20 transition-colors group">
                    <td className="px-6 py-4 font-mono text-gray-400">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white group-hover:text-orange-500 transition-colors">{order.customerName}</span>
                        <span className="text-xs text-gray-500">{order.email}</span>
                        {order.phone && <span className="text-xs text-gray-500">{order.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-[200px]">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="text-xs text-gray-400 truncate">
                            {item.quantity}x {item.name} ({item.size})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 font-medium text-white">EGP {order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-md ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        className="bg-gray-900 border border-gray-800 text-gray-300 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500 appearance-none cursor-pointer hover:bg-gray-800 transition-colors"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
