import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getOrders } from "@/lib/collections/orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; status?: string }>;
}) {
  await requireAdmin();
  const orders = await getOrders();
  const { phone, status } = await searchParams;
  const filtered = orders.filter((o) => {
    if (phone && !o.phone.includes(phone)) return false;
    if (status && o.status !== status) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Filter by phone"
          defaultValue={phone}
          name="phone"
          className="max-w-xs"
          form="filter-form"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          form="filter-form"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <form id="filter-form" method="get" className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Filter
          </button>
        </form>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Total (BDT)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((o) => (
                <TableRow key={o._id.toString()}>
                  <TableCell className="font-mono text-xs">
                    {o.invoiceId ?? o._id.toString().slice(-8)}
                  </TableCell>
                  <TableCell>{o.phone}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{o.address}</TableCell>
                  <TableCell>
                    {o.deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"} (৳
                    {o.deliveryCharge})
                  </TableCell>
                  <TableCell>৳{o.total.toLocaleString()}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${o._id.toString()}`}
                      className="text-primary underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
