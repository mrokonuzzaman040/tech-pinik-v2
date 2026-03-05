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

  const categoryOptions = categories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
  }));
  const serializedProduct = {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    images: product.images,
    stock: product.stock,
    featured: product.featured,
    order: product.order,
    sku: product.sku,
    brand: product.brand,
    model: product.model,
    warranty: product.warranty,
    color: product.color,
    compatibility: product.compatibility,
    connectivity: product.connectivity,
    specifications: product.specifications,
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">← Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit product</h1>
      </div>
      <ProductForm product={serializedProduct} categories={categoryOptions} />
    </div>
  );
}
