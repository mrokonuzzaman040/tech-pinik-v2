import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/collections/products";
import { getCategories } from "@/lib/collections/categories";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const { category: categorySlug } = await searchParams;
  const filtered =
    categorySlug && categorySlug.trim()
      ? products.filter((p) => {
          const cat = categories.find((c) => c.slug === categorySlug.trim());
          return cat && p.categoryId === cat._id.toString();
        })
      : products;

  return (
    <div className="container px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold">Products</h1>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`rounded-md border px-4 py-2 text-sm transition-colors ${
              !categorySlug
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id.toString()}
              href={`/products?category=${encodeURIComponent(c.slug)}`}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                categorySlug === c.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No products found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <Link key={p._id.toString()} href={`/products/${p.slug}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-square bg-muted">
                  {p.images[0] ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-primary font-semibold">
                    ৳{p.price.toLocaleString()}
                  </p>
                  {p.stock <= 0 && (
                    <p className="text-sm text-muted-foreground">Out of stock</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
