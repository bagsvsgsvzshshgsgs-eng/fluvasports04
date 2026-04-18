"use client";

import { useStore } from "@/components/StoreContext";

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Shipped": return "bg-amber-100 text-amber-700";
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-900 text-gray-700";
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-serif text-white mb-1">Orders</h1>
        <p className="text-gray-400 text-sm">Manage customer orders and fulfillment status.</p>
      </header>

      <div className="bg-black border border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="bg-black border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-orange-500 w-64" 
            />
          </div>
          <p className="text-gray-400 text-sm">{orders.length} Orders Total</p>
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
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-light">
                    No orders have been placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-black/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{order.customerName}</span>
                        <span className="text-xs text-gray-500">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{order.date}</td>
                    <td className="px-6 py-4 font-medium text-white">EGP {order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        className="bg-black border border-gray-800 px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
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
