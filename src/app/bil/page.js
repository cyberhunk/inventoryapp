// src/app/orders/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok && data.ok) {
          setOrders(data.orders);
        }
      } catch (e) {
        console.error("Load orders error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">
          Saved Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-slate-600 text-sm">No orders saved yet.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2">Product</th>
                  <th className="text-left px-4 py-2">Size</th>
                  <th className="text-left px-4 py-2">Color</th>
                  <th className="text-right px-4 py-2">Qty</th>
                  <th className="text-right px-4 py-2">Price</th>
                  <th className="text-left px-4 py-2">Customer</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Mobile</th>
                  <th className="text-left px-4 py-2">City</th>
                  <th className="text-left px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b last:border-b-0 border-slate-100"
                  >
                    <td className="px-4 py-2">{order.productName}</td>
                    <td className="px-4 py-2">{order.size}</td>
                    <td className="px-4 py-2">{order.color}</td>
                    <td className="px-4 py-2 text-right">{order.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      ₹{order.price ?? "-"}
                    </td>
                    <td className="px-4 py-2">
                      {order.customer?.fullName || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {order.customer?.email || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {order.customer?.phone || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {order.customer?.city || "-"}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
