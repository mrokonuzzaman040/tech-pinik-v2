import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/collections/products";
import { getCategories } from "@/lib/collections/categories";
import { Card, CardContent } from "@/components/ui/card";
import { PackageOpen } from "lucide-react";
import { ProductsFilters } from "./products-filters";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; q?: string }>;
}) {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const { category: categorySlug, brand: brandFilter, q: searchQuery } = await searchParams;
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))] as string[];

  let filtered = products;
  if (categorySlug?.trim()) {
    const cat = categories.find((c) => c.slug === categorySlug.trim());
    if (cat) filtered = filtered.filter((p) => p.categoryId === cat._id.toString());
  }
  if (brandFilter?.trim()) {
    filtered = filtered.filter((p) => p.brand === brandFilter.trim());
  }
  if (searchQuery?.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.model && p.model.toLowerCase().includes(q))
    );
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mb-10">
        <span className="text-sm font-medium uppercase tracking-wider text-primary">
          Shop
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
          Shop by category
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our products or filter by category below.
        </p>
      </div>

      <ProductsFilters
        categories={categories}
        categorySlug={categorySlug ?? undefined}
        brands={brands}
        brandFilter={brandFilter ?? undefined}
        searchQuery={searchQuery ?? undefined}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
          <PackageOpen className="size-12 text-muted-foreground" />
          <p className="mt-4 font-medium text-foreground">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another category or browse all products.
          </p>
          <Link
            href="/products"
            className="mt-6 text-sm font-medium text-primary hover:underline"
          >
            View all products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <Link key={p._id.toString()} href={`/products/${p.slug}`}>
              <Card className="group overflow-hidden border-border transition-all hover:border-primary/20 hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {p.images[0] ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  {p.stock <= 0 && (
                    <span className="absolute left-3 top-3 rounded-md bg-destructive/90 px-2 py-1 text-xs font-medium text-white">
                      Out of stock
                    </span>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium">
                      View
                    </span>
                  </span>
                </div>
                <CardContent className="p-4">
                  {p.brand && (
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {p.brand}
                    </p>
                  )}
                  <p className="font-semibold leading-snug line-clamp-2 group-hover:text-primary mt-0.5">
                    {p.name}
                  </p>
                  {p.sku && (
                    <p className="text-xs text-muted-foreground mt-1">SKU: {p.sku}</p>
                  )}
                  <p className="mt-2 text-lg font-bold text-primary">
                    ৳{p.price.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
