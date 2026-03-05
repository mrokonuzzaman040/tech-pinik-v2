import { requireAdmin } from "@/lib/admin-auth";
import { CategoryForm } from "../category-form";

export default async function NewCategoryPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New category</h1>
      <CategoryForm />
    </div>
  );
}
