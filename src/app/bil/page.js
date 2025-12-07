// "use client";
 
// import { useEffect, useState } from "react";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadOrders = async () => {
//       try {
//         const res = await fetch("/api/products");
//         const data = await res.json();
//         if (res.ok && data.ok) {
//           setOrders(data.orders);
//         }
//       } catch (e) {
//         console.error("Load orders error:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadOrders();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-slate-700">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl font-semibold text-slate-900 mb-4">
//           Saved Orders
//         </h1>

//         {orders.length === 0 ? (
//           <p className="text-slate-600 text-sm">No orders saved yet.</p>
//         ) : (
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
//             <table className="w-full text-sm min-w-[900px]">
//               <thead className="bg-slate-100 border-b border-slate-200">
//                 <tr>
//                   <th className="text-left px-4 py-2">Product</th>
//                   <th className="text-left px-4 py-2">Size</th>
//                   <th className="text-left px-4 py-2">Color</th>
//                   <th className="text-right px-4 py-2">Qty</th>
//                   <th className="text-right px-4 py-2">Price</th>
//                   <th className="text-left px-4 py-2">Customer</th>
//                   <th className="text-left px-4 py-2">Email</th>
//                   <th className="text-left px-4 py-2">Mobile</th>
//                   <th className="text-left px-4 py-2">City</th>
//                   <th className="text-left px-4 py-2">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr
//                     key={order._id}
//                     className="border-b last:border-b-0 border-slate-100"
//                   >
//                     <td className="px-4 py-2">{order.productName}</td>
//                     <td className="px-4 py-2">{order.size}</td>
//                     <td className="px-4 py-2">{order.color}</td>
//                     <td className="px-4 py-2 text-right">{order.quantity}</td>
//                     <td className="px-4 py-2 text-right">
//                       ₹{order.price ?? "-"}
//                     </td>
//                     <td className="px-4 py-2">
//                       {order.customer?.fullName || "-"}
//                     </td>
//                     <td className="px-4 py-2">
//                       {order.customer?.email || "-"}
//                     </td>
//                     <td className="px-4 py-2">
//                       {order.customer?.phone || "-"}
//                     </td>
//                     <td className="px-4 py-2">
//                       {order.customer?.city || "-"}
//                     </td>
//                     <td className="px-4 py-2 text-xs text-slate-500">
//                       {order.createdAt
//                         ? new Date(order.createdAt).toLocaleString()
//                         : "-"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null); // edit ke time
  const [deletingId, setDeletingId] = useState(null); // delete ke time

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

  // simple inline edit: quantity + price
  const handleQuickEdit = async (order) => {
    const newQty = prompt("New quantity:", order.quantity);
    if (newQty === null) return;

    const newPrice = prompt("New price (₹):", order.price ?? 0);
    if (newPrice === null) return;

    setSavingId(order._id);
    try {
      const res = await fetch(`/api/products?id=${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: Number(newQty),
          price: Number(newPrice),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? { ...o, quantity: Number(newQty), price: Number(newPrice) }
            : o
        )
      );
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 w-full  py-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-2xl text-center font-semibold text-slate-900 mb-4">
          Saved Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-slate-600 text-sm">No orders saved yet.</p>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto overflow-y-auto ">
            <table border={1} className="w-full text-sm min-w-[1000px] overflow-x-auto">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr className="[&>th]:border [&>th]:border-gray-200">
                  <th className="text-left px-2 py-2 w-2">No</th>
                  <th className="text-left px-4 py-2 w-100">Product</th>
                  <th className="text-left px-4 py-2">Size</th>
                  <th className="text-left px-4 py-2">Color</th>
                  <th className="text-right px-4 py-2">Qty</th>
                  <th className="text-right px-4 py-2">Price</th>
                  <th className="text-right px-4 py-2 w-100">Total Price</th>
                  <th className="text-left px-4 py-2">Customer</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Mobile</th>
                  <th className="text-left px-4 py-2">City</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, id) => {
                  const firstItem = order.items?.[0]; // multi-items order ka first product
                  return (
                    <tr
                      key={order._id}
                      className="border-b last:border-b-0 border-slate-100 [&>td]:border [&>td]:border-gray-200"
                    >
                      <td className="px-2 py-2">{id + 1 || "-"}</td>
                      <td className="px-4 py-2">
                        {firstItem?.productName || order.productName || "-"}
                      </td>
                      <td className="px-4 py-2">
                        {firstItem?.size || order.size || "-"}
                      </td>
                      <td className="px-4 py-2">
                        {firstItem?.color || order.color || "-"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {firstItem?.quantity ?? order.quantity ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ₹{firstItem?.price ?? order.price ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ₹{firstItem?.total ?? order.total ?? "-"}
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

                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleQuickEdit(order)}
                            className="px-2 py-1 text-xs rounded-md bg-amber-500 text-white hover:bg-amber-400 cursor-pointer"
                            disabled={
                              savingId === order._id || deletingId === order._id
                            }
                          >
                            {savingId === order._id ? "Saving..." : "Edit"}
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="px-2 py-1 text-xs rounded-md bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                            disabled={deletingId === order._id}
                          >
                            {deletingId === order._id
                              ? "Deleting..."
                              : "Delete"}
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
    </div>
  );
}
