// "use client";
// import { useEffect, useState } from "react";
// import logo from "../../../../public/logo.png";

// export default function InvoicePopup({
//   showInvoice,
//   lastOrder,
//   onClose,
//   handlePrint,
// }) {
//   if (!showInvoice || !lastOrder) return null;

//    const [invoiceNumber, setInvoiceNumber] = useState("");

//   useEffect(() => {
//     // Random invoice number generate karna
//     const randomNum = Math.floor(100 + Math.random() * 900);
//     const datePart = new Date().getTime();
//     setInvoiceNumber(`INV-${datePart}-${randomNum}`);
//   }, []);

//   return (
//     <>
//       {/* Blur Overlay */}
//       <div
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//         onClick={onClose}
//       />

//       {/* Centered Popup */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none ">
//         <div
//           className=" pointer-events-auto relative "
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* === Yahi pura tumhara invoice code === */}
//           <div
//             id="invoice"
//             className="mt-6 bg-white border border-slate-300 rounded-2xl shadow-md px-6 py-5"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-auto h-12 bg-slate-900 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
//                   <img src={logo.src} alt="Logo" className="h-18 w-auto" />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold text-slate-900">
//                     Tact Lifestyle
//                   </h2>
//                   <p className="text-xs text-slate-600">
//                     Premium Streetwear Clothing • Indore, India
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     tactlifestyle.store • Contact@tactlifestyle.store
//                   </p>
//                 </div>
//               </div>

//               <div className="text-right text-xs text-slate-600">
//                 <p>
//                   Invoice Date:{" "}
//                   {lastOrder.createdAt
//                     ? new Date(lastOrder.createdAt).toLocaleString()
//                     : "--"}
//                 </p>
//                 <p>Invoice : {invoiceNumber}</p>
//               </div>
//             </div>

//             <hr className="border-slate-200 mb-4" />

//             <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
//               <div className="space-y-1">
//                 <h3 className="font-semibold text-slate-800 mb-1">Bill To</h3>
//                 <p>{lastOrder.customer?.fullName}</p>
//                 <p>{lastOrder.customer?.city}</p>
//                 <p>Mobile: {lastOrder.customer?.phone}</p>
//                 <p>Email: {lastOrder.customer?.email}</p>
//               </div>

//               <div className="space-y-1 md:text-right">
//                 <h3 className="font-semibold text-slate-800 mb-1">Ship From</h3>
//                 <p>Tact Lifestyle</p>
//                 <p>Indore, Madhya Pradesh</p>
//                 <p>India</p>
//               </div>
//             </div>

//             <table className="w-full text-sm border border-slate-200 mb-4">
//               <thead className="bg-slate-100">
//                 <tr>
//                   <th className="text-left px-3 py-2 border-b border-slate-200">
//                     Product
//                   </th>
//                   <th className="text-left px-3 py-2 border-b border-slate-200">
//                     Size / Color
//                   </th>
//                   <th className="text-right px-3 py-2 border-b border-slate-200">
//                     Qty
//                   </th>
//                   <th className="text-right px-3 py-2 border-b border-slate-200">
//                     Price
//                   </th>
//                   <th className="text-right px-3 py-2 border-b border-slate-200">
//                     Total
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="px-3 py-2 border-b border-slate-200">
//                     {lastOrder.productName}
//                   </td>
//                   <td className="px-3 py-2 border-b border-slate-200">
//                     {lastOrder.size} / {lastOrder.color}
//                   </td>
//                   <td className="px-3 py-2 text-right border-b border-slate-200">
//                     {lastOrder.quantity}
//                   </td>
//                   <td className="px-3 py-2 text-right border-b border-slate-200">
//                     ₹{lastOrder.price}
//                   </td>
//                   <td className="px-3 py-2 text-right border-b border-slate-200">
//                     ₹
//                     {Number(lastOrder.price || 0) *
//                       Number(lastOrder.quantity || 1)}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             <div className="flex justify-between items-start mb-3 text-sm">
//               <div className="text-xs text-slate-500">
//                               <p>{lastOrder._id}</p>
//                 <p>Payment Status: Paid</p>
//               </div>
//               <div className="w-48">
//                 <div className="flex justify-between py-1">
//                   <span className="text-slate-600">Subtotal</span>
//                   <span className="font-medium text-slate-800">
//                     ₹
//                     {Number(lastOrder.price || 0) *
//                       Number(lastOrder.quantity || 1)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between py-1">
//                   <span className="text-slate-600">Tax</span>
//                   <span className="font-medium text-slate-800">₹0</span>
//                 </div>
//                 <div className="flex justify-between py-1 border-t border-slate-200 mt-1 pt-1">
//                   <span className="font-semibold text-slate-900">
//                     Grand Total
//                   </span>
//                   <span className="font-semibold text-slate-900">
//                     ₹
//                     {Number(lastOrder.price || 0) *
//                       Number(lastOrder.quantity || 1)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <p className="text-xs text-slate-600 mt-4">
//               Thank you for shopping with Tact Lifestyle. We hope you enjoy your
//               new fit. For any support, contact us at
//               Contact@tactlifestyle.store.
//             </p>

//             <div className="mt-4 flex gap-2 justify-end">
//               <button
//                 type="button"
//                 onClick={handlePrint}
//                 className="rounded-lg bg-blue-600 text-white text-xs px-3 py-1.5 hover:bg-blue-500 cursor-pointer"
//               >
//                 Print bill
//               </button>
//               <button
//                 type="button"
//                 onClick={handlePrint}
//                 className="rounded-lg bg-slate-800 text-white text-xs px-3 py-1.5 hover:bg-slate-700 cursor-pointer"
//               >
//                 Download PDF
//               </button>
//             </div>
//           </div>

//           {/* Bottom Close button (optional, extra) */}
//           <div className="flex justify-end p-4 pt-0 border-t border-slate-200/50 absolute top-8 right-0">
//             <button
//               onClick={onClose}
//               className=" hover:bg-slate-800 text-red-900  text-sm font-medium"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import logo from "../../../../public/logo.png";

export default function InvoicePopup({
  showInvoice,
  lastOrder,
  onClose,
  handlePrint,
}) {
  if (!showInvoice || !lastOrder) return null;

  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const datePart = new Date().getTime();
    setInvoiceNumber(`INV-${datePart}-${randomNum}`);
  }, []);

  // total for all line items
  const subtotal =
    lastOrder.items?.reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
      0
    ) || 0;

  return (
    <>
      {/* Blur Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40  "
        onClick={onClose}
      />

      {/* Centered Popup */}
      <div className="fixed  inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-auto mt-15 mb-5 pt-30">
        <div
          id="invoice"
          className="pointer-events-auto "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Invoice */}
          <div
            // id="invoice"
            className="mt-6  bg-white border border-slate-300 rounded-2xl shadow-md px-6 py-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-auto h-12 bg-slate-900 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                  <img src={logo.src} alt="Logo" className="h-18 w-auto" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Tact Lifestyle
                  </h2>
                  <p className="text-xs text-slate-600">
                    Premium Streetwear Clothing • Indore, India
                  </p>
                  <p className="text-xs text-slate-500">
                    tactlifestyle.store • Contact@tactlifestyle.store
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-600">
                <p>
                  Invoice Date:{" "}
                  {lastOrder.createdAt
                    ? new Date(lastOrder.createdAt).toLocaleString()
                    : "--"}
                </p>
                <p>Invoice: {invoiceNumber}</p>
              </div>
            </div>

            <hr className="border-slate-200 mb-4" />

            {/* Customer + shop info */}
            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-800 mb-1">Bill To</h3>
                <p>{lastOrder.customer?.fullName || "--"}</p>
                <p>{lastOrder.customer?.city || ""}</p>
                <p>Mobile: {lastOrder.customer?.phone || ""}</p>
                <p>Email: {lastOrder.customer?.email || ""}</p>
              </div>

              <div className="space-y-1 md:text-right">
                <h3 className="font-semibold text-slate-800 mb-1">Ship From</h3>
                <p>Tact Lifestyle</p>
                <p>Indore, Madhya Pradesh</p>
                <p>India</p>
              </div>
            </div>

            {/* Line items table (all products) */}
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
                {lastOrder.items?.map((item, idx) => {
                  const lineTotal =
                    Number(item.price || 0) * Number(item.quantity || 1);
                  return (
                    <tr key={idx}>
                      <td className="px-3 py-2 border-b border-slate-200">
                        {item.productName || "--"}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-200">
                        {item.size} / {item.color}
                      </td>
                      <td className="px-3 py-2 text-right border-b border-slate-200">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2 text-right border-b border-slate-200">
                        ₹{item.price}
                      </td>
                      <td className="px-3 py-2 text-right border-b border-slate-200">
                        ₹{lineTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals + meta */}
            <div className="flex justify-between items-start mb-3 text-sm">
              <div className="text-xs text-slate-500">
                <p>{lastOrder._id}</p>
                <p>Payment Status: Paid</p>
              </div>
              <div className="w-48">
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-800">
                    ₹{subtotal}
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
                    ₹{subtotal}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              Thank you for shopping with Tact Lifestyle. We hope you enjoy your
              new fit. For any support, contact us at
              Contact@tactlifestyle.store.
            </p>

            {/* Buttons */}
            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg bg-blue-600 text-white text-xs px-3 py-1.5 hover:bg-blue-500 cursor-pointer"
              >
                Print bill
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg bg-slate-800 text-white text-xs px-3 py-1.5 hover:bg-slate-700 cursor-pointer"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* Close button */}
          {/* <div className="flex justify-end p-4 pt-0 border-t border-slate-200/50 absolute top-8 right-0">
            <button
              onClick={onClose}
              className="text-sm font-medium text-white bg-red-500 px-8 py-2 rounded hover:text-red-700"
            >
              Close
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}
