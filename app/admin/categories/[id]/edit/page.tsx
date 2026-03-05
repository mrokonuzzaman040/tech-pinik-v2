import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getCategoryById } from "@/lib/collections/categories";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "../../category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/categories">← Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit category</h1>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
