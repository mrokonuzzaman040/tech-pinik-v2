import { ObjectId } from "mongodb";
import { db } from "@/lib/db";

export type Slider = {
  _id: ObjectId;
  title: string;
  image: string;
  link?: string;
  order?: number;
  active: boolean;
};

const COLLECTION = "sliders";

export async function getSliders(): Promise<Slider[]> {
  const list = await db
    .collection<Slider>(COLLECTION)
    .find({})
    .sort({ order: 1 })
    .toArray();
  return list;
}

export async function getSliderById(id: string): Promise<Slider | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db
    .collection<Slider>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc;
}

export async function createSlider(data: {
  title: string;
  image: string;
  link?: string;
  order?: number;
  active: boolean;
}): Promise<Slider> {
  const result = await db.collection<Slider>(COLLECTION).insertOne({
    ...data,
    _id: new ObjectId(),
  });
  const doc = await db
    .collection<Slider>(COLLECTION)
    .findOne({ _id: result.insertedId });
  if (!doc) throw new Error("Failed to create slider");
  return doc;
}

export async function updateSlider(
  id: string,
  data: Partial<Omit<Slider, "_id">>
): Promise<Slider | null> {
  if (!ObjectId.isValid(id)) return null;
  await db.collection<Slider>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  return getSliderById(id);
}

export async function deleteSlider(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const result = await db
    .collection<Slider>(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
