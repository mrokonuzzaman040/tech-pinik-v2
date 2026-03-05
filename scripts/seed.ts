/**
 * Seed script: inserts sample categories, products, and sliders.
 * Run with: npm run seed (ensure MONGODB_URI is set, e.g. in .env.local)
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { ObjectId } from "mongodb";
import { db } from "../lib/db";

const CATEGORIES_COLLECTION = "categories";
const PRODUCTS_COLLECTION = "products";
const SLIDERS_COLLECTION = "sliders";

const PLACEHOLDER_IMAGE = "https://placehold.co/800x800?text=Product";
const PLACEHOLDER_SLIDER = "https://placehold.co/1200x400?text=Tech+Pinik";

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local and try again.");
  }

  const categories = await db.collection(CATEGORIES_COLLECTION).find({}).toArray();
  const products = await db.collection(PRODUCTS_COLLECTION).find({}).toArray();
  const sliders = await db.collection(SLIDERS_COLLECTION).find({}).toArray();

  if (categories.length > 0 || products.length > 0 || sliders.length > 0) {
    console.log("Database already has data. Skipping seed (idempotent).");
    console.log("  Categories:", categories.length, "| Products:", products.length, "| Sliders:", sliders.length);
    process.exit(0);
  }

  const now = new Date();

  const categoryIds: ObjectId[] = [];
  const categoryDocs = [
    { _id: new ObjectId(), name: "Electronics", slug: "electronics", order: 1 },
    { _id: new ObjectId(), name: "Accessories", slug: "accessories", order: 2 },
    { _id: new ObjectId(), name: "Gadgets", slug: "gadgets", order: 3 },
    { _id: new ObjectId(), name: "Cables & Adapters", slug: "cables-adapters", order: 4 },
  ];
  for (const c of categoryDocs) {
    categoryIds.push(c._id);
    await db.collection(CATEGORIES_COLLECTION).insertOne(c);
  }
  console.log("Inserted", categoryDocs.length, "categories.");

  const productDocs = [
    {
      _id: new ObjectId(),
      name: "Wireless Earbuds Pro",
      slug: "wireless-earbuds-pro",
      description: "High-quality wireless earbuds with noise cancellation and 24hr battery.",
      price: 2499,
      categoryId: categoryIds[0].toString(),
      images: [PLACEHOLDER_IMAGE],
      stock: 25,
      featured: true,
      order: 1,
      createdAt: now,
    },
    {
      _id: new ObjectId(),
      name: "USB-C Hub 7-in-1",
      slug: "usb-c-hub-7in1",
      description: "Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader.",
      price: 1899,
      categoryId: categoryIds[2].toString(),
      images: [PLACEHOLDER_IMAGE],
      stock: 40,
      featured: true,
      order: 2,
      createdAt: now,
    },
    {
      _id: new ObjectId(),
      name: "Phone Stand Adjustable",
      slug: "phone-stand-adjustable",
      description: "Sturdy adjustable stand for phones and small tablets.",
      price: 399,
      categoryId: categoryIds[1].toString(),
      images: [PLACEHOLDER_IMAGE],
      stock: 100,
      featured: false,
      order: 3,
      createdAt: now,
    },
    {
      _id: new ObjectId(),
      name: "Braided USB-C Cable 2m",
      slug: "braided-usb-c-cable-2m",
      description: "Durable braided USB-C to USB-A cable, 2 meters.",
      price: 349,
      categoryId: categoryIds[3].toString(),
      images: [PLACEHOLDER_IMAGE],
      stock: 0,
      featured: false,
      order: 4,
      createdAt: now,
    },
    {
      _id: new ObjectId(),
      name: "Bluetooth Speaker Mini",
      slug: "bluetooth-speaker-mini",
      description: "Portable Bluetooth speaker with 10hr playback.",
      price: 1299,
      categoryId: categoryIds[0].toString(),
      images: [PLACEHOLDER_IMAGE],
      stock: 30,
      featured: true,
      order: 5,
      createdAt: now,
    },
    {
      _id: new ObjectId(),
      name: "Screen Protector Pack",
      slug: "screen-protector-pack",
      description: "Tempered glass screen protector, 2-pack.",
      price: 299,
      categoryId: categoryIds[1].toString(),
      images: [PLACEHOLDER_IMAGE],
      stock: 80,
      featured: false,
      order: 6,
      createdAt: now,
    },
    {
      _id: new ObjectId(),
      name: "Power Bank 10000mAh",
      slug: "power-bank-10000mah",
      description: "Fast-charge power bank with dual USB output.",
      price: 1599,
      categoryId: categoryIds[2].toString(),
      images: [PLACEHOLDER_IMAGE],
      stock: 20,
      featured: true,
      order: 7,
      createdAt: now,
    },
    {
      _id: new ObjectId(),
      name: "HDMI to HDMI Cable 1.5m",
      slug: "hdmi-cable-1-5m",
      description: "High-speed HDMI cable for 4K support.",
      price: 449,
      categoryId: categoryIds[3].toString(),
      images: [PLACEHOLDER_IMAGE],
      stock: 50,
      featured: false,
      order: 8,
      createdAt: now,
    },
  ];
  await db.collection(PRODUCTS_COLLECTION).insertMany(productDocs);
  console.log("Inserted", productDocs.length, "products.");

  const sliderDocs = [
    { _id: new ObjectId(), title: "Welcome to Tech Pinik", image: PLACEHOLDER_SLIDER, link: "/products", order: 1, active: true },
    { _id: new ObjectId(), title: "New Arrivals", image: PLACEHOLDER_SLIDER, link: "/products?category=electronics", order: 2, active: true },
    { _id: new ObjectId(), title: "Free Delivery in Dhaka", image: PLACEHOLDER_SLIDER, order: 3, active: true },
  ];
  await db.collection(SLIDERS_COLLECTION).insertMany(sliderDocs);
  console.log("Inserted", sliderDocs.length, "sliders.");

  console.log("Seed completed successfully.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });