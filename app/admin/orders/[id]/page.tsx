import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getOrderById } from "@/lib/collections/orders";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusUpdate } from "./order-status-update";
import { InvoiceSection } from "./invoice-section";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">← Back to orders</Link>
        </Button>
        <h1 className="text-2xl font-semibold">
          Order {order.invoiceId ?? order._id.toString().slice(-8)}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer & delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
            {order.note && <p><strong>Note:</strong> {order.note}</p>}
            <p>
              <strong>Delivery:</strong>{" "}
              {order.deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"} — ৳
              {order.deliveryCharge}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusUpdate orderId={id} currentStatus={order.status} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">Price</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium text-right">Subtotal</th>
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
            <span className="font-semibold">Total: ৳{order.total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <InvoiceSection order={order} />
    </div>
  );
}
