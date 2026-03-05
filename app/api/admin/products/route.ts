import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createProduct } from "@/lib/collections/products";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const description = String(body.description ?? "").trim();
  const price = Number(body.price);
  const categoryId = String(body.categoryId ?? "").trim();
  const images = Array.isArray(body.images) ? body.images.map(String) : [];
  const stock = Number(body.stock) || 0;
  const featured = Boolean(body.featured);
  const order = typeof body.order === "number" ? body.order : 0;

  if (!name || !slug || !categoryId) {
    return NextResponse.json(
      { error: "Name, slug and category are required" },
      { status: 400 }
    );
  }
  if (Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const product = await createProduct({
    name,
    slug,
    description,
    price,
    categoryId,
    images,
    stock,
    featured,
    order,
  });
  return NextResponse.json(product);
}
