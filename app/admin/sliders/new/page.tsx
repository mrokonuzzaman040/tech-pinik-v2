import { requireAdmin } from "@/lib/admin-auth";
import { SliderForm } from "../slider-form";

export default async function NewSliderPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New slider</h1>
      <SliderForm />
    </div>
  );
}
