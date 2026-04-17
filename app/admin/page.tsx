"use client";

import { useStore } from "@/components/StoreContext";
import Link from "next/link";

export default function AdminDashboard() {
  const { orders, products } = useStore();

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.5%", icon: "💰" },
    { label: "Total Orders", value: orders.length.toString(), change: "+8.2%", icon: "📦" },
    { label: "Inventory", value: products.length.toString(), change: "+0.4%", icon: "👙" },
    { label: "Active Customers", value: new Set(orders.map(o => o.email)).size.toString(), change: "+15.3%", icon: "👥" },
  ];


  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-black border border-gray-800 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-black transition-colors">Download Report</button>
          <button className="bg-orange-500 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">Add New Product</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-black p-6 border border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-serif text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-black border border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-serif text-white">Recent Orders</h2>
          <button className="text-gray-400 text-sm hover:underline">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black text-gray-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-light italic">
                    No orders to display.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-black/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-400">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{order.customerName}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{order.date}</td>
                    <td className="px-6 py-4 font-medium text-white">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-gray-900 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href="/admin/orders" className="text-gray-500 hover:text-white underline underline-offset-4">Manage</Link>
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
