import { ObjectId } from "mongodb";
import { db } from "@/lib/db";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type DeliveryZone = "inside_dhaka" | "outside_dhaka";

export type Order = {
  _id: ObjectId;
  phone: string;
  address: string;
  note?: string;
  deliveryZone: DeliveryZone;
  deliveryCharge: number;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: string;
  invoiceId?: string;
  createdAt: Date;
};

const COLLECTION = "orders";

export const DELIVERY_CHARGE = {
  inside_dhaka: 65,
  outside_dhaka: 110,
} as const;

export async function getOrders(): Promise<Order[]> {
  const list = await db
    .collection<Order>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return list;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db
    .collection<Order>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc;
}

export async function createOrder(data: Omit<Order, "_id" | "createdAt">): Promise<Order> {
  const now = new Date();
  const result = await db.collection<Order>(COLLECTION).insertOne({
    ...data,
    _id: new ObjectId(),
    createdAt: now,
  });
  const doc = await db
    .collection<Order>(COLLECTION)
    .findOne({ _id: result.insertedId });
  if (!doc) throw new Error("Failed to create order");
  return doc;
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<Order | null> {
  if (!ObjectId.isValid(id)) return null;
  await db.collection<Order>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
  return getOrderById(id);
}

export async function updateOrderInvoiceId(
  id: string,
  invoiceId: string
): Promise<Order | null> {
  if (!ObjectId.isValid(id)) return null;
  await db.collection<Order>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { invoiceId } }
  );
  return getOrderById(id);
}

function generateInvoiceId(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `INV-${y}${m}${d}-${random}`;
}

export function getNewInvoiceId(): string {
  return generateInvoiceId();
}
