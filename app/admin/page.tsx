"use client";

import { useStore } from "@/components/StoreContext";
import Link from "next/link";
import { 
  DollarSign, ShoppingBag, Users, TrendingUp,
  ArrowRight, Plus, Image as ImageIcon, Tag,
  Package, Star, AlertTriangle, ClipboardList,
  BarChart2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  Processing: '#3b82f6',
  Shipped:    '#f59e0b',
  Delivered:  '#10b981',
  Cancelled:  '#ef4444',
};

function buildRevenueChart(orders: any[]) {
  const map: Record<string, number> = {};
  orders.forEach(o => {
    const d = new Date(o.date || Date.now());
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    map[key] = (map[key] || 0) + (o.total || 0);
  });
  if (Object.keys(map).length === 0) {
    return [
      { name: 'Mon', revenue: 0 }, { name: 'Tue', revenue: 0 },
      { name: 'Wed', revenue: 0 }, { name: 'Thu', revenue: 0 },
      { name: 'Fri', revenue: 0 }, { name: 'Sat', revenue: 0 },
      { name: 'Sun', revenue: 0 },
    ];
  }
  return Object.entries(map).slice(-7).map(([name, revenue]) => ({ name, revenue }));
}

function buildTopProducts(orders: any[]) {
  const map: Record<string, number> = {};
  orders.forEach(o => {
    (o.items || []).forEach((item: any) => {
      map[item.name] = (map[item.name] || 0) + item.quantity;
    });
  });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name: name.length > 22 ? name.slice(0, 22) + '…' : name, count }));
}

export default function AdminDashboard() {
  const { orders, products, reviews, activityLogs, settings, adminUser } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;
  const activeCustomers = new Set(orders.map(o => o.email)).size;
  const pendingReviews = reviews.filter(r => r.status === 'Pending').length;
  const recentOrders = orders.slice(0, 5);

  const revenueData = buildRevenueChart(orders);
  const topProducts = buildTopProducts(orders);

  // Order status breakdown for pie
  const statusBreakdown = (['Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(s => ({
    name: s,
    value: orders.filter(o => o.status === s).length,
  })).filter(s => s.value > 0);

  const stats = [
    { label: "Total Revenue",    value: `EGP ${totalRevenue.toLocaleString()}`,        change: "+12.5%", positive: true,  icon: <DollarSign size={20} className="text-orange-500" /> },
    { label: "Total Orders",     value: orders.length.toString(),                       change: "+8.2%",  positive: true,  icon: <ShoppingBag size={20} className="text-blue-500" /> },
    { label: "Avg. Order Value", value: `EGP ${avgOrder.toFixed(0)}`,                  change: "+4.1%",  positive: true,  icon: <TrendingUp size={20} className="text-purple-500" /> },
    { label: "Unique Customers", value: activeCustomers.toString(),                     change: "+15.3%", positive: true,  icon: <Users size={20} className="text-green-500" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">
            Welcome back, <span className="text-orange-500 font-medium">{adminUser?.name || 'Admin'}</span>.
            Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-md transition-colors shadow-sm">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Maintenance Banner */}
      {settings.maintenanceMode && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-500 shrink-0" size={20} />
          <div>
            <p className="text-red-400 font-medium text-sm">Maintenance Mode is Active</p>
            <p className="text-gray-500 text-xs">Visitors are being redirected to the maintenance page. <Link href="/admin/settings" className="text-orange-400 hover:underline">Disable in Settings →</Link></p>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-black p-6 border border-gray-900 rounded-xl hover:border-gray-800 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-900 rounded-lg">{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-medium">{stat.label}</p>
            <p className="text-2xl font-serif text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-black border border-gray-900 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BarChart2 size={18} className="text-orange-500" />
              <h2 className="text-lg font-serif text-white">Revenue (Last 7 Days)</h2>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#374151', color: '#fff', borderRadius: '8px' }} itemStyle={{ color: '#f97316' }} />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} name="Revenue (EGP)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie */}
        <div className="bg-black border border-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-serif text-white mb-6">Order Status</h2>
          {statusBreakdown.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-600 flex-col gap-2">
              <ShoppingBag size={32} className="opacity-30" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      {statusBreakdown.map((entry, index) => (
                        <Cell key={index} fill={STATUS_COLORS[entry.name] || '#6b7280'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#374151', color: '#fff', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {statusBreakdown.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[s.name] }} />
                      <span className="text-gray-400">{s.name}</span>
                    </div>
                    <span className="text-white font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Products + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products Bar */}
        <div className="lg:col-span-2 bg-black border border-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-serif text-white mb-6">Top Products by Orders</h2>
          {topProducts.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-600 flex-col gap-2">
              <Package size={32} className="opacity-30" />
              <p className="text-sm">Place some orders to see top products</p>
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={130} stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#374151', color: '#fff', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} name="Units Ordered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-black border border-gray-900 rounded-xl p-6 flex flex-col gap-3">
          <h2 className="text-lg font-serif text-white mb-2">Quick Actions</h2>
          {[
            { href: '/admin/content/banners',    icon: <ImageIcon size={18} />, label: 'Manage Banners',    sub: 'Update hero images',         color: 'text-orange-500 bg-orange-500/10' },
            { href: '/admin/discounts',          icon: <Tag size={18} />,       label: 'Discount Codes',   sub: `${settings.discounts?.length || 0} active codes`, color: 'text-blue-500 bg-blue-500/10' },
            { href: '/admin/reviews',            icon: <Star size={18} />,      label: 'Reviews',          sub: `${pendingReviews} pending`,   color: 'text-yellow-500 bg-yellow-500/10' },
            { href: '/admin/logs',               icon: <ClipboardList size={18} />, label: 'Activity Logs', sub: `${activityLogs.length} entries`, color: 'text-purple-500 bg-purple-500/10' },
          ].map(({ href, icon, label, sub, color }) => (
            <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/30 hover:bg-gray-900 border border-transparent hover:border-gray-800 transition-colors group">
              <div className={`p-2 rounded-md ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-gray-500 truncate">{sub}</p>
              </div>
              <ArrowRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-black border border-gray-900 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-900 flex justify-between items-center">
          <h2 className="text-lg font-serif text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-orange-500 text-sm hover:text-orange-400 font-medium">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/40 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-900">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic">No orders yet.</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-zinc-950 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-400 text-xs">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{order.customerName}</p>
                    <p className="text-[10px] text-gray-600">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-white">EGP {order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold ${
                      order.status === 'Delivered'  ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      order.status === 'Shipped'    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
