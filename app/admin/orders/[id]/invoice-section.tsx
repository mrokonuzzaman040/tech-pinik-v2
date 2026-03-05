"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "@/lib/collections/orders";

export function InvoiceSection({ order }: { order: Order }) {
  const printRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const invoiceId = order.invoiceId ?? `INV-${order._id.toString().slice(-8)}`;

  function handlePrint() {
    if (!printRef.current) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>Invoice ${invoiceId}</title></head>
        <body>
          ${printRef.current.innerHTML}
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    w.document.close();
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={printRef} className="rounded border bg-white p-6 text-black print:border-0 print:shadow-none">
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">Tech Pinik</h2>
            <p className="text-sm text-gray-600">Bangladesh E-commerce</p>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Invoice ID</p>
              <p>{invoiceId}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Date</p>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mb-6 text-sm">
            <p className="font-medium">Customer</p>
            <p>Phone: {order.phone}</p>
            <p>Address: {order.address}</p>
            {order.note && <p>Note: {order.note}</p>}
          </div>
          <div className="mb-4 text-sm">
            <p className="font-medium">Delivery</p>
            <p>
              {order.deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"} — ৳
              {order.deliveryCharge}
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium">Item</th>
                <th className="pb-2 text-right font-medium">Price</th>
                <th className="pb-2 text-right font-medium">Qty</th>
                <th className="pb-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-right">৳{item.price.toLocaleString()}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end gap-8 text-sm">
            <span>Subtotal: ৳{order.subtotal.toLocaleString()}</span>
            <span>Delivery: ৳{order.deliveryCharge}</span>
            <span className="font-bold">Total: ৳{order.total.toLocaleString()} BDT</span>
          </div>
        </div>
        <Button className="mt-4" onClick={handlePrint}>
          Print invoice
        </Button>
      </CardContent>
    </Card>
  );
}
