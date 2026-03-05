import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { getCategories } from "@/lib/collections/categories";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const categoryLinks = categories.slice(0, 6).map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
  }));
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader categoryLinks={categoryLinks} />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  );
}
