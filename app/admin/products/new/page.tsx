import { requireAdmin } from "@/lib/admin-auth";
import { getCategories } from "@/lib/collections/categories";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories();
  const categoryOptions = categories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
  }));
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New product</h1>
      <ProductForm categories={categoryOptions} />
    </div>
  );
}
