import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { updateProduct, deleteProduct } from "@/lib/collections/products";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const specifications = Array.isArray(body.specifications)
    ? (body.specifications as { key: string; value: string }[]).filter(
        (s) => s && typeof s.key === "string" && typeof s.value === "string"
      )
    : undefined;
  const updated = await updateProduct(id, {
    name: body.name,
    slug: body.slug,
    description: body.description,
    price: body.price,
    categoryId: body.categoryId,
    images: body.images,
    stock: body.stock,
    featured: body.featured,
    order: body.order,
    sku: body.sku != null ? String(body.sku).trim() || undefined : undefined,
    brand: body.brand != null ? String(body.brand).trim() || undefined : undefined,
    model: body.model != null ? String(body.model).trim() || undefined : undefined,
    warranty: body.warranty != null ? String(body.warranty).trim() || undefined : undefined,
    color: body.color != null ? String(body.color).trim() || undefined : undefined,
    compatibility: body.compatibility != null ? String(body.compatibility).trim() || undefined : undefined,
    connectivity: body.connectivity != null ? String(body.connectivity).trim() || undefined : undefined,
    specifications: specifications?.length ? specifications : undefined,
  });
  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
