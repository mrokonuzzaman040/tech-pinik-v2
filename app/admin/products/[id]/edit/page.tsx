import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getProductById } from "@/lib/collections/products";
import { getCategories } from "@/lib/collections/categories";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">← Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit product</h1>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
