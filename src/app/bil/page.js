"use client";
import { useEffect, useState, useMemo } from "react";
import InvoicePopup from "../Components/InvoicePopup/InvoicePopup";

// Modal कॉम्पोनेंट (इसमें कोई बदलाव नहीं)
const OrderDetailsModal = ({ order, onClose, onPrint }) => {
  if (!order) return null;

  const totalOrderValue = order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );
  
  const totalItems = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            &times;
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-2 border-b pb-1">Customer Information</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <p><strong className="text-slate-600">Name:</strong> {order.customer?.fullName || "-"}</p>
            <p><strong className="text-slate-600">Email:</strong> {order.customer?.email || "-"}</p>
            <p><strong className="text-slate-600">Phone:</strong> {order.customer?.phone || "-"}</p>
            <p><strong className="text-slate-600">City:</strong> {order.customer?.city || "-"}</p>
            <p><strong className="text-slate-600">Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Order Items ({totalItems})</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left">Product Name</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Color</th>
                  <th className="px-4 py-2 text-right">Qty</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2">{item.size}</td>
                    <td className="px-4 py-2">{item.color}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">₹{item.price.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => onPrint(order)}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500"
            >
              Print Bill
            </button>
            <p className="text-xl font-bold text-slate-800">
                Grand Total: ₹{totalOrderValue.toLocaleString()}
            </p>
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

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

  // === कुल बिक्री और प्रोडक्ट्स की गणना (सही किया हुआ) ===
  const { totalRevenue, totalProductsSold } = useMemo(() => {
    let revenue = 0;
    let productsSold = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        // अगर price या quantity मौजूद नहीं है तो 0 मानें
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        revenue += itemTotal;
        productsSold += item.quantity || 0;
      });
    });

    return { totalRevenue: revenue, totalProductsSold: productsSold };
  }, [orders]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuickEdit = async (order) => {
    const firstItem = order.items?.[0];
    if (!firstItem) {
      alert("No items in this order to edit.");
      return;
    }
    const newQty = prompt("New quantity for " + firstItem.productName + ":", firstItem.quantity);
    if (newQty === null) return;
    const newPrice = prompt("New price (₹):", firstItem.price ?? 0);
    if (newPrice === null) return;
    setSavingId(order._id);
    try {
      const res = await fetch(`/api/products?id=${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: firstItem._id,
          quantity: Number(newQty),
          price: Number(newPrice),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed");
      setOrders((prevOrders) =>
        prevOrders.map((o) => {
          if (o._id === order._id) {
            const updatedItems = o.items.map((item, index) => 
                index === 0 ? { ...item, quantity: Number(newQty), price: Number(newPrice), total: Number(newQty) * Number(newPrice) } : item
            );
            return { ...o, items: updatedItems };
          }
          return o;
        })
      );
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    } finally {
      setSavingId(null);
    }
  };

  
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handlePrintBill = (order) => {
    setInvoiceOrder(order);
    setShowInvoice(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 w-full py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Saved Orders
          </h1>
          {!loading && orders.length > 0 && (
            <div className="text-right">
              <p className="font-semibold text-slate-800 text-lg">
                Total Sales: <span className="text-green-600">₹{totalRevenue.toLocaleString()}</span>
              </p>
              <p className="text-sm text-slate-600">
                Total Products Sold: {totalProductsSold}
              </p>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <p className="text-slate-600 text-sm">No orders saved yet.</p>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[1200px]">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr className="[&>th]:border [&>th]:border-gray-200">
                  <th className="px-2 py-2 w-12">No</th>
                  <th className="px-4 py-2 text-left">Products</th>
                  <th className="px-4 py-2 text-center w-24">Total Items</th>
                  <th className="px-4 py-2 text-right w-32">Order Total</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Mobile</th>
                  <th className="px-4 py-2 text-left">City</th>
                  <th className="px-4 py-2 text-left w-40">Date</th>
                  <th className="px-4 py-2 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, id) => {
                  const firstItem = order.items?.[0];
                  // Order total is now calculated safely as well
                  const orderTotal = order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
                  const totalItems = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                  
                  return (
                    <tr key={order._id} className="border-b last:border-b-0 border-slate-100 hover:bg-slate-50 [&>td]:border [&>td]:border-gray-200">
                      <td className="px-2 py-2 text-center">{id + 1}</td>
                      <td className="px-4 py-2 font-medium">
                        {firstItem?.productName || "-"}
                        {order.items.length > 1 && (
                          <span className="text-xs text-slate-500 ml-1">
                            +{order.items.length - 1} more
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">{totalItems}</td>
                      <td className="px-4 py-2 text-right font-semibold">₹{orderTotal.toLocaleString()}</td>
                      <td className="px-4 py-2">{order.customer?.fullName || "-"}</td>
                      <td className="px-4 py-2">{order.customer?.email || "-"}</td>
                      <td className="px-4 py-2">{order.customer?.phone || "-"}</td>
                      <td className="px-4 py-2">{order.customer?.city || "-"}</td>
                      <td className="px-4 py-2 text-xs text-slate-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2 justify-center flex-wrap">
                           <button onClick={() => handleViewDetails(order)} className="px-2 py-1 text-xs rounded-md bg-sky-600 text-white hover:bg-sky-500">
                            View Details
                          </button>
                          <button onClick={() => handlePrintBill(order)} className="px-2 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-500">
                            Print Bill
                          </button>
                          <button onClick={() => handleQuickEdit(order)} className="px-2 py-1 text-xs rounded-md bg-amber-500 text-white hover:bg-amber-400" disabled={savingId === order._id || deletingId === order._id}>
                            {savingId === order._id ? "Saving..." : "Edit"}
                          </button>
                          <button onClick={() => handleDelete(order._id)} className="px-2 py-1 text-xs rounded-md bg-rose-600 text-white hover:bg-rose-500" disabled={deletingId === order._id}>
                            {deletingId === order._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <OrderDetailsModal order={selectedOrder} onClose={closeModal} onPrint={handlePrintBill} />
      <InvoicePopup
        showInvoice={showInvoice}
        lastOrder={invoiceOrder}
        onClose={() => setShowInvoice(false)}
        handlePrint={handlePrint}
      />
    </div>
  );
}