import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/admin-auth";
import { getSliders } from "@/lib/collections/sliders";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteSliderButton } from "./delete-slider-button";

export default async function AdminSlidersPage() {
  await requireAdmin();
  const sliders = await getSliders();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sliders</h1>
        <Button asChild>
          <Link href="/admin/sliders/new">
            <Plus className="mr-2 size-4" />
            Add slider
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sliders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No sliders yet.
                </TableCell>
              </TableRow>
            ) : (
              sliders.map((s) => (
                <TableRow key={s._id.toString()}>
                  <TableCell>
                    <div className="relative h-14 w-24 overflow-hidden rounded border">
                      <Image
                        src={s.image}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{s.link ?? "—"}</TableCell>
                  <TableCell>{s.active ? "Yes" : "No"}</TableCell>
                  <TableCell>{s.order ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/sliders/${s._id.toString()}/edit`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteSliderButton id={s._id.toString()} title={s.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
