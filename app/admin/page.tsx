"use client";

import { useStore } from "@/components/StoreContext";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Plus,
  Image as ImageIcon,
  Tag
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
];

export default function AdminDashboard() {
  const { orders } = useStore();

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const recentOrders = orders.slice(0, 5);
  const activeCustomers = new Set(orders.map(o => o.email)).size;

  const stats = [
    { label: "Total Revenue", value: `EGP ${totalRevenue.toLocaleString()}`, change: "+12.5%", isPositive: true, icon: <DollarSign size={20} className="text-orange-500" /> },
    { label: "Total Orders", value: orders.length.toString(), change: "+8.2%", isPositive: true, icon: <ShoppingBag size={20} className="text-blue-500" /> },
    { label: "Active Customers", value: activeCustomers.toString(), change: "+15.3%", isPositive: true, icon: <Users size={20} className="text-green-500" /> },
    { label: "Conversion Rate", value: "3.2%", change: "-0.4%", isPositive: false, icon: <TrendingUp size={20} className="text-purple-500" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Welcome back. Here is what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm flex items-center gap-2 rounded-md">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-black p-6 border border-gray-900 rounded-xl shadow-sm hover:border-gray-800 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-900 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-medium">{stat.label}</p>
            <p className="text-2xl font-serif text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-black border border-gray-900 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-serif text-white">Revenue Overview</h2>
            <select className="bg-gray-900 text-gray-300 text-sm border-none outline-none rounded-md px-3 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black border border-gray-900 rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-serif text-white mb-6">Quick Actions</h2>
          <div className="space-y-3 flex-1">
            <Link href="/admin/content/banners" className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-800 group">
              <div className="p-2 bg-orange-500/10 rounded-md text-orange-500 group-hover:scale-110 transition-transform">
                <ImageIcon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">Manage Banners</h3>
                <p className="text-xs text-gray-500">Update homepage heroes</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </Link>
            
            <Link href="/admin/content/promotions" className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-800 group">
              <div className="p-2 bg-blue-500/10 rounded-md text-blue-500 group-hover:scale-110 transition-transform">
                <Tag size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">Promotions</h3>
                <p className="text-xs text-gray-500">Sale & Planet Water</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </Link>

            <Link href="/admin/media" className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-800 group">
              <div className="p-2 bg-purple-500/10 rounded-md text-purple-500 group-hover:scale-110 transition-transform">
                <ImageIcon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">Media Library</h3>
                <p className="text-xs text-gray-500">Upload & manage assets</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-black border border-gray-900 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-900 flex justify-between items-center">
          <h2 className="text-lg font-serif text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-orange-500 text-sm hover:text-orange-400 transition-colors font-medium">View All Orders →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-900">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-sm">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-light italic">
                    No orders to display.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-400">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{order.customerName}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{order.date}</td>
                    <td className="px-6 py-4 font-medium text-white">EGP {order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        order.status === 'Shipped' ? 'bg-gray-800 text-gray-300 border border-gray-700' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {order.status}
                      </span>
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
