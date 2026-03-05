import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { hashPassword } from "better-auth/crypto";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const secret = process.env.BOOTSTRAP_ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Bootstrap not configured" },
      { status: 404 }
    );
  }

  let body: { secret?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.secret !== secret || !body.email || !body.password) {
    return NextResponse.json({ error: "Unauthorized or missing email/password" }, { status: 401 });
  }

  const email = String(body.email).toLowerCase().trim();
  const password = String(body.password);
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const users = db.collection("user");
  const existing = await users.findOne({ email });
  if (existing) {
    const updated = await users.findOneAndUpdate(
      { email },
      { $set: { role: "admin", updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    return NextResponse.json({
      message: "User already exists; role set to admin",
      user: { id: updated?._id?.toString(), email: updated?.email },
    });
  }

  const _id = new ObjectId();
  const now = new Date();
  const hashedPassword = await hashPassword(password);

  await users.insertOne({
    _id,
    name: "Admin",
    email,
    emailVerified: false,
    image: null,
    createdAt: now,
    updatedAt: now,
    role: "admin",
  });

  const accounts = db.collection("account");
  await accounts.insertOne({
    userId: _id,
    accountId: _id.toString(),
    providerId: "credential",
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({
    message: "Admin user created. Remove BOOTSTRAP_ADMIN_SECRET from env and sign in at /admin/login.",
    user: { id: _id.toString(), email },
  });
}
