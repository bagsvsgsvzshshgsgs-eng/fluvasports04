"use client";

import { useStore } from "@/components/StoreContext";
import { useMemo, useState } from "react";

type CustomerSummary = {
  email: string;
  name: string;
  phone?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  lastStatus: string;
};

export default function AdminCustomers() {
  const { orders } = useStore();
  const [search, setSearch] = useState("");

  const customers: CustomerSummary[] = useMemo(() => {
    const map: Record<string, CustomerSummary> = {};

    for (const order of orders) {
      if (!map[order.email]) {
        map[order.email] = {
          email: order.email,
          name: order.customerName,
          phone: order.phone,
          totalSpent: 0,
          orderCount: 0,
          lastOrderDate: order.date,
          lastStatus: order.status,
        };
      }
      map[order.email].totalSpent += order.total;
      map[order.email].orderCount += 1;
      // Keep latest order date / status
      map[order.email].lastOrderDate = order.date;
      map[order.email].lastStatus = order.status;
    }

    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Shipped":   return "bg-amber-100 text-amber-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default:          return "bg-gray-900 text-gray-700";
    }
  };

  const getTierLabel = (spent: number) => {
    if (spent >= 1000) return { label: "VIP", color: "bg-[#b09165]/20 text-[#8a6a3a]" };
    if (spent >= 500)  return { label: "Gold", color: "bg-yellow-100 text-yellow-700" };
    return               { label: "Standard", color: "bg-gray-900 text-gray-400" };
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white mb-1">Customers</h1>
          <p className="text-gray-400 text-sm">
            Overview of all customers derived from order history.
          </p>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Customers", value: customers.length.toString(), icon: "👥" },
          { label: "Total Revenue",   value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: "💰" },
          { label: "Avg. Order Value", value: `$${avgOrderValue.toFixed(2)}`, icon: "🧾" },
        ].map((stat, i) => (
          <div key={i} className="bg-black border border-gray-800 shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-serif text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Customers Table */}
      <div className="bg-black border border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-72"
          />
          <p className="text-gray-400 text-sm">{filtered.length} Customer{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black text-gray-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Tier</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Last Order</th>
                <th className="px-6 py-4 font-medium">Last Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-gray-500 font-light italic"
                  >
                    {orders.length === 0
                      ? "No customers yet. Orders will appear here once placed."
                      : "No customers match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => {
                  const tier = getTierLabel(customer.totalSpent);
                  return (
                    <tr
                      key={customer.email}
                      className="hover:bg-black/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {customer.name}
                          </span>
                          <span className="text-[11px] text-gray-500 mt-0.5">
                            {customer.email}
                          </span>
                          {customer.phone && (
                            <span className="text-[11px] text-gray-500">
                              {customer.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${tier.color}`}
                        >
                          {tier.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {customer.orderCount}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {customer.lastOrderDate}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${getStatusColor(customer.lastStatus)}`}
                        >
                          {customer.lastStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
