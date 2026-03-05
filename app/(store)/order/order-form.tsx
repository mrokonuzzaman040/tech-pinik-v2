"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/cart-context";

type ProductOption = { id: string; name: string; price: number };

const DELIVERY_OPTIONS = [
  { value: "inside_dhaka", label: "Inside Dhaka — ৳65", charge: 65 },
  { value: "outside_dhaka", label: "Outside Dhaka — ৳110", charge: 110 },
] as const;

export function OrderForm({ products }: { products: ProductOption[] }) {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCart();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<
    "inside_dhaka" | "outside_dhaka"
  >("inside_dhaka");
  const [items, setItems] = useState<
    Array<{ productId: string; quantity: number }>
  >([{ productId: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      setItems(
        cartItems.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
        }))
      );
    }
  }, [cartItems]);

  function addLine() {
    setItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  }

  function updateLine(
    index: number,
    field: "productId" | "quantity",
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, [field]: value } : line
      )
    );
  }

  function removeLine(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim() || undefined,
        deliveryZone,
        items: items
          .filter((line) => line.productId && line.quantity >= 1)
          .map((line) => ({
            productId: line.productId,
            quantity: Number(line.quantity) || 1,
          })),
      };
      if (payload.items.length === 0) {
        setError("Add at least one product");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to place order");
        return;
      }
      clearCart();
      alert(
        `Order placed. Invoice: ${data.invoiceId ?? data.orderId}. Total: ৳${data.total}`
      );
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01XXXXXXXXX"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Delivery instructions, etc."
        />
      </div>
      <div className="space-y-2">
        <Label>Delivery *</Label>
        <select
          value={deliveryZone}
          onChange={(e) =>
            setDeliveryZone(e.target.value as "inside_dhaka" | "outside_dhaka")
          }
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          {DELIVERY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Items *</Label>
        {items.map((line, i) => (
          <div key={i} className="flex gap-2">
            <select
              value={line.productId}
              onChange={(e) => updateLine(i, "productId", e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2"
              required={i === 0}
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ৳{p.price.toLocaleString()}
                </option>
              ))}
            </select>
            <Input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => updateLine(i, "quantity", e.target.value)}
              className="w-20"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeLine(i)}
              disabled={items.length === 1}
            >
              −
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addLine}>
          Add item
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Placing order…" : "Place order"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </form>
  );
}
