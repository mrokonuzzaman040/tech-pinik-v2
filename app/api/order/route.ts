import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/collections/products";
import {
  createOrder,
  getNewInvoiceId,
  DELIVERY_CHARGE,
  type DeliveryZone,
} from "@/lib/collections/orders";

const MAX_ITEMS = 20;
const MAX_NOTE_LENGTH = 500;
const MAX_ADDRESS_LENGTH = 500;

export async function POST(request: NextRequest) {
  let body: {
    phone?: string;
    address?: string;
    note?: string;
    deliveryZone?: string;
    items?: Array<{ productId: string; quantity: number }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phone = String(body.phone ?? "").trim();
  const address = String(body.address ?? "").trim();
  const note = body.note != null ? String(body.note).slice(0, MAX_NOTE_LENGTH) : undefined;
  const deliveryZone = body.deliveryZone as DeliveryZone | undefined;
  const itemsInput = Array.isArray(body.items) ? body.items : [];

  if (!phone || !address) {
    return NextResponse.json(
      { error: "Phone and address are required" },
      { status: 400 }
    );
  }
  if (address.length > MAX_ADDRESS_LENGTH) {
    return NextResponse.json(
      { error: "Address too long" },
      { status: 400 }
    );
  }
  if (
    deliveryZone !== "inside_dhaka" &&
    deliveryZone !== "outside_dhaka"
  ) {
    return NextResponse.json(
      { error: "Invalid delivery zone. Use inside_dhaka or outside_dhaka" },
      { status: 400 }
    );
  }
  if (itemsInput.length === 0 || itemsInput.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: "Between 1 and 20 items required" },
      { status: 400 }
    );
  }

  const deliveryCharge = DELIVERY_CHARGE[deliveryZone];
  const orderItems: { productId: string; name: string; price: number; quantity: number }[] = [];
  let subtotal = 0;

  for (const row of itemsInput) {
    const productId = String(row.productId ?? "").trim();
    const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));
    if (!productId) continue;
    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product not found: ${productId}` },
        { status: 400 }
      );
    }
    orderItems.push({
      productId: product._id.toString(),
      name: product.name,
      price: product.price,
      quantity,
    });
    subtotal += product.price * quantity;
  }

  if (orderItems.length === 0) {
    return NextResponse.json({ error: "No valid items" }, { status: 400 });
  }

  const total = subtotal + deliveryCharge;
  const invoiceId = getNewInvoiceId();

  const order = await createOrder({
    phone,
    address,
    note,
    deliveryZone,
    deliveryCharge,
    items: orderItems,
    subtotal,
    total,
    status: "Pending",
    invoiceId,
  });

  return NextResponse.json({
    orderId: order._id.toString(),
    invoiceId: order.invoiceId ?? invoiceId,
    total,
    message: "Order placed successfully",
  });
}
