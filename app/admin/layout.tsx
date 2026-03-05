import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";

  if (pathname === "/admin/login" || pathname.endsWith("/admin/login")) {
    return <>{children}</>;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="font-semibold">
            Tech Pinik Admin
          </Link>
        </div>
        <AdminNav />
      </aside>
      <div className="flex flex-1 flex-col">
        <AdminHeader user={session.user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
