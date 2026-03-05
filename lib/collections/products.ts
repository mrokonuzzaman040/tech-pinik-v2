import { ObjectId } from "mongodb";
import { db } from "@/lib/db";

export type Product = {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  stock: number;
  featured?: boolean;
  order?: number;
  createdAt: Date;
};

const COLLECTION = "products";

export async function getProducts(): Promise<Product[]> {
  const list = await db
    .collection<Product>(COLLECTION)
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .toArray();
  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db
    .collection<Product>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const doc = await db
    .collection<Product>(COLLECTION)
    .findOne({ slug });
  return doc;
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  stock: number;
  featured?: boolean;
  order?: number;
}): Promise<Product> {
  const now = new Date();
  const result = await db.collection<Product>(COLLECTION).insertOne({
    ...data,
    _id: new ObjectId(),
    createdAt: now,
  });
  const doc = await db
    .collection<Product>(COLLECTION)
    .findOne({ _id: result.insertedId });
  if (!doc) throw new Error("Failed to create product");
  return doc;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "_id" | "createdAt">>
): Promise<Product | null> {
  if (!ObjectId.isValid(id)) return null;
  await db.collection<Product>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const result = await db
    .collection<Product>(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
