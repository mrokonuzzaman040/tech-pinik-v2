import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createSlider } from "@/lib/collections/sliders";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const image = String(body.image ?? "").trim();
  if (!title || !image) {
    return NextResponse.json(
      { error: "Title and image are required" },
      { status: 400 }
    );
  }

  const slider = await createSlider({
    title,
    image,
    link: body.link,
    order: typeof body.order === "number" ? body.order : 0,
    active: Boolean(body.active),
  });
  return NextResponse.json(slider);
}
