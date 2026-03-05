import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createCategory } from "@/lib/collections/categories";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  const category = await createCategory({
    name,
    slug,
    image: body.image,
    order: typeof body.order === "number" ? body.order : 0,
  });
  return NextResponse.json(category);
}
