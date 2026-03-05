import Link from "next/link";
import Image from "next/image";
import { getSliders } from "@/lib/collections/sliders";
import { getFeaturedProducts } from "@/lib/collections/products";
import { getCategories } from "@/lib/collections/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const [sliders, featuredProducts, categories] = await Promise.all([
    getSliders(),
    getFeaturedProducts(),
    getCategories(),
  ]);
  const activeSliders = sliders.filter((s) => s.active);

  return (
    <div>
      {activeSliders.length > 0 && (
        <section className="border-b bg-muted/30">
          <div className="container px-4 py-6">
            <div className="overflow-hidden rounded-lg border bg-background">
              <div className="relative aspect-[3/1] w-full overflow-hidden">
                {activeSliders[0]?.link ? (
                  <Link href={activeSliders[0].link} className="block h-full w-full">
                    <Image
                      src={activeSliders[0].image}
                      alt={activeSliders[0].title}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </Link>
                ) : (
                  <Image
                    src={activeSliders[0].image}
                    alt={activeSliders[0].title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured products</h2>
          <Button asChild variant="outline">
            <Link href="/products">View all</Link>
          </Button>
        </div>
        {featuredProducts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No featured products yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 8).map((p) => (
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="border-t bg-muted/20 py-12">
          <div className="container px-4">
            <h2 className="mb-6 text-2xl font-semibold">Shop by category</h2>
            <div className="flex flex-wrap gap-4">
              {categories.map((c) => (
                <Button key={c._id.toString()} variant="secondary" asChild>
                  <Link href={`/products?category=${encodeURIComponent(c.slug)}`}>
                    {c.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
