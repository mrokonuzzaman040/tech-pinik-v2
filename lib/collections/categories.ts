import { ObjectId } from "mongodb";
import { db } from "@/lib/db";

export type Category = {
  _id: ObjectId;
  name: string;
  slug: string;
  image?: string;
  order?: number;
};

const COLLECTION = "categories";

export async function getCategories(): Promise<Category[]> {
  const list = await db
    .collection<Category>(COLLECTION)
    .find({})
    .sort({ order: 1, name: 1 })
    .toArray();
  return list;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db
    .collection<Category>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const doc = await db
    .collection<Category>(COLLECTION)
    .findOne({ slug });
  return doc;
}

export async function createCategory(data: {
  name: string;
  slug: string;
  image?: string;
  order?: number;
}): Promise<Category> {
  const result = await db.collection<Category>(COLLECTION).insertOne({
    ...data,
    _id: new ObjectId(),
  });
  const doc = await db
    .collection<Category>(COLLECTION)
    .findOne({ _id: result.insertedId });
  if (!doc) throw new Error("Failed to create category");
  return doc;
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "_id">>
): Promise<Category | null> {
  if (!ObjectId.isValid(id)) return null;
  await db.collection<Category>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  return getCategoryById(id);
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const result = await db
    .collection<Category>(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
