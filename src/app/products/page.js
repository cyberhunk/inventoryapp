// src/app/order/page.jsx
"use client";

import { useState, useMemo } from "react";
import logo from "../../../public/logo.png";


const productNames = [
  '"Hey Puddin" Regular Crop Top',
  "Beige Basic Oversized Tee",
  "Black Basic Oversized tee",
  "Cement Blue Basic Oversized Tee",
  "Central Perk Regular Cropped Tee",
  "Cream Basic Oversized Tee",
  "Embrace yourself Oversized Cropped Tee",
  "Enchantment Oversized Tee",
  "Ghost of Tsushima Oversized Tee (Beige)",
  "Ghost of Tsushima Oversized Tee (Cream)",
  "Ghost of Tsushima Oversized Tee (Red)",
  "Hot Red Basic Oversized Tee",
  "Kiss Pop Oversized Cropped Tee",
  "Lavender Basic Oversized T-shirt",
  "Lovestruck Angel Oversized Tee",
  "Neon Skull Illusion Puff Oversized Tee",
  "Olive Green Basic Oversized Tee",
  "Onion Basic Oversized Tee",
  "Pay Now",
  "Peace of Mind Oversized Tee",
  "Pretty Annoying Oversized Cropped Tee",
  "Spider-Gwen Regular Cropped Tee",
  "Spidey Oversized Tee",
  "Why So Serious? Oversized Tee",
  "Wolverine Claw Oversized Tee",
  "Wonder Woman Regular Cropped Tee",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Beige",
  "Purple",
];

export default function OrderFormPage() {
  const [productName, setProductName] = useState("");
  const [typedName, setTypedName] = useState("");
  const [size, setSize] = useState("M");
  const [color, setColor] = useState(colors[0]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  //   proint
  const [lastOrder, setLastOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // filtered suggestions based on typed text
  const suggestions = useMemo(() => {
    if (!typedName.trim()) return productNames;
    const lower = typedName.toLowerCase();
    return productNames.filter((n) => n.toLowerCase().includes(lower));
  }, [typedName]);

  const handleNameClick = (name) => {
    setProductName(name);
    setTypedName(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      productName,
      size,
      color,
      price: Number(price),
      quantity: Number(quantity),
      customer: { fullName, email, phone, city },
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error();
      //   .................
      setLastOrder(payload);
      setShowInvoice(true);

      setMessage("Order saved successfully.");
    } catch {
      setMessage("Error saving order.");
    } finally {
      setLoading(false);
    }
  };

  //   ldkjf
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Inventory Order
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Log a new product order with size, color, price, quantity and
            customer details.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.6fr,1.1fr] gap-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl shadow-md px-6 py-6 lg:px-8 lg:py-7 space-y-6"
          >
            {/* Product name + suggestions */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-800">
                Product name
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent transition"
                placeholder="Type or select a product"
                value={typedName}
                onChange={(e) => {
                  setTypedName(e.target.value);
                  setProductName(e.target.value);
                }}
              />
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                {suggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleNameClick(name)}
                    className={`text-xs rounded-full border px-3 py-1.5 transition
                    ${
                      productName === name
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product details */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800">
                  Size
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900
                             focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800">
                  Color
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900
                             focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Customer info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800">
                  Customer full name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800">
                  Mobile number
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-800">
                  City
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900
                             placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-500">
                On submit, this order will be stored in MongoDB.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium 
                           text-white shadow-sm hover:bg-blue-500 disabled:opacity-60 transition"
              >
                {loading ? "Saving..." : "Submit order"}
              </button>
            </div>

            {message && (
              <p className="text-sm mt-1 text-slate-700">{message}</p>
            )}
          </form>

          {/* Side summary */}
          <div className="hidden lg:flex flex-col bg-white border border-slate-200 rounded-2xl px-5 py-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Current selection
            </h2>
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="text-slate-500">Product:</span>{" "}
                {productName || "Not selected"}
              </p>
              <p>
                <span className="text-slate-500">Size:</span> {size}
              </p>
              <p>
                <span className="text-slate-500">Color:</span> {color}
              </p>
              <p>
                <span className="text-slate-500">Price:</span>{" "}
                {price ? `₹${price}` : "—"}
              </p>
              <p>
                <span className="text-slate-500">Quantity:</span> {quantity}
              </p>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-3 text-xs text-slate-500">
              Simple internal tool UI for managing TacT Lifestyle apparel
              orders.
            </div>
          </div>
        </div>
      </div>
      {showInvoice && lastOrder && (
        <div
          id="invoice"
          className="mt-6 bg-white border border-slate-300 rounded-2xl shadow-md px-6 py-5"
        >
          {/* Header with logo and shop details */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Shop logo / initials */}
              <div className="w-auto h-12  bg-slate-900 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                {/* <img src="/tact-logo.png" alt="TacT Lifestyle" className="w-full h-full object-cover" /> */}
                <img src={logo.src} alt="Logo" className="h-18 w-auto" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  TacT Lifestyle
                </h2>
                <p className="text-xs text-slate-600">
                  Premium Streetwear Clothing • Indore, India
                </p>
                <p className="text-xs text-slate-500">
                  tactlifestyle.store • support@tactlifestyle.store
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600">
              <p>
                Invoice Date: {new Date(lastOrder.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <hr className="border-slate-200 mb-4" />

          {/* Customer + shop info */}
          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-800 mb-1">Bill To</h3>
              <p>{lastOrder.customer.fullName}</p>
              <p>{lastOrder.customer.city}</p>
              <p>Mobile: {lastOrder.customer.phone}</p>
              <p>Email: {lastOrder.customer.email}</p>
            </div>

            <div className="space-y-1 md:text-right">
              <h3 className="font-semibold text-slate-800 mb-1">Ship From</h3>
              <p>TacT Lifestyle</p>
              <p>Indore, Madhya Pradesh</p>
              <p>India</p>
            </div>
          </div>

          {/* Line item table */}
          <table className="w-full text-sm border border-slate-200 mb-4">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-3 py-2 border-b border-slate-200">
                  Product
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-200">
                  Size / Color
                </th>
                <th className="text-right px-3 py-2 border-b border-slate-200">
                  Qty
                </th>
                <th className="text-right px-3 py-2 border-b border-slate-200">
                  Price
                </th>
                <th className="text-right px-3 py-2 border-b border-slate-200">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b border-slate-200">
                  {lastOrder.productName}
                </td>
                <td className="px-3 py-2 border-b border-slate-200">
                  {lastOrder.size} / {lastOrder.color}
                </td>
                <td className="px-3 py-2 text-right border-b border-slate-200">
                  {lastOrder.quantity}
                </td>
                <td className="px-3 py-2 text-right border-b border-slate-200">
                  ₹{lastOrder.price}
                </td>
                <td className="px-3 py-2 text-right border-b border-slate-200">
                  ₹
                  {Number(lastOrder.price || 0) *
                    Number(lastOrder.quantity || 1)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals + thank you */}
          <div className="flex justify-between items-start mb-3 text-sm">
            <div className="text-xs text-slate-500">
              <p>Payment Status: Pending / Paid</p>
            </div>
            <div className="w-48">
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-800">
                  ₹
                  {Number(lastOrder.price || 0) *
                    Number(lastOrder.quantity || 1)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium text-slate-800">₹0</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-200 mt-1 pt-1">
                <span className="font-semibold text-slate-900">
                  Grand Total
                </span>
                <span className="font-semibold text-slate-900">
                  ₹
                  {Number(lastOrder.price || 0) *
                    Number(lastOrder.quantity || 1)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-4">
            Thank you for shopping with TacT Lifestyle. We hope you enjoy your
            new fit. For any support, contact us at support@tactlifestyle.store.
          </p>

          {/* Screen-only buttons (print / download) */}
          <div className="mt-4 flex gap-2 justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg bg-blue-600 text-white text-xs px-3 py-1.5 hover:bg-blue-500"
            >
              Print bill
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg bg-slate-800 text-white text-xs px-3 py-1.5 hover:bg-slate-700"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
