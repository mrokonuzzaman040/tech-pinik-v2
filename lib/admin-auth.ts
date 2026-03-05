import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "admin") {
    redirect("/admin/login");
  }
  return session;
}
