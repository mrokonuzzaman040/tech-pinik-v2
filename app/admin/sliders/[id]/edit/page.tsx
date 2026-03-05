import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getSliderById } from "@/lib/collections/sliders";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SliderForm } from "../../slider-form";

export default async function EditSliderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const slider = await getSliderById(id);
  if (!slider) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/sliders">← Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit slider</h1>
      </div>
      <SliderForm slider={slider} />
    </div>
  );
}
