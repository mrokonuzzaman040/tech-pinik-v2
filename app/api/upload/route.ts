import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { imagekit } from "@/lib/imagekit";
import { toFile } from "@imagekit/nodejs";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file || !file.size) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = file.name || `file-${Date.now()}`;

  try {
    const uploadable = await toFile(buffer, fileName, { type: file.type });
    const result = await imagekit.beta.v2.files.upload({
      file: uploadable,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    if (!result.url) {
      return NextResponse.json(
        { error: "Upload succeeded but no URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url, fileId: result.fileId });
  } catch (err) {
    console.error("ImageKit upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
