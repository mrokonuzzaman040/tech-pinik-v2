import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/admin-auth";
import { getProducts } from "@/lib/collections/products";
import { getCategories } from "@/lib/collections/categories";
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
import { DeleteProductButton } from "./delete-product-button";

export default async function AdminProductsPage() {
  await requireAdmin();
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const categoryMap = new Map(categories.map((c) => [c._id.toString(), c.name]));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 size-4" />
            Add product
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (BDT)</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No products yet.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p._id.toString()}>
                  <TableCell>
                    {p.images[0] ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded border">
                        <Image
                          src={p.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.sku ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.brand ?? "—"}</TableCell>
                  <TableCell>{categoryMap.get(p.categoryId) ?? p.categoryId}</TableCell>
                  <TableCell>৳{p.price.toLocaleString()}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/products/${p._id.toString()}/edit`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteProductButton id={p._id.toString()} name={p.name} />
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
