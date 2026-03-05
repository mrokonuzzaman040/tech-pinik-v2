import Link from "next/link";
import Image from "next/image";
import { getSliders } from "@/lib/collections/sliders";
import { getFeaturedProducts } from "@/lib/collections/products";
import { getCategories } from "@/lib/collections/categories";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield } from "lucide-react";

export default async function HomePage() {
  const [sliders, featuredProducts, categories] = await Promise.all([
    getSliders(),
    getFeaturedProducts(),
    getCategories(),
  ]);
  const activeSliders = sliders.filter((s) => s.active);

  return (
    <div className="min-h-screen">
      {/* Hero / Slider */}
      <section className="relative w-full overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-900">
        {activeSliders.length > 0 ? (
          <div className="relative aspect-21/9 min-h-[280px] w-full md:aspect-3/1 md:min-h-[320px]">
            {activeSliders[0].link ? (
              <Link href={activeSliders[0].link} className="block h-full w-full">
                <Image
                  src={activeSliders[0].image}
                  alt={activeSliders[0].title}
                  fill
                  className="object-cover object-center"
                  priority
                  unoptimized
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/20 transition-opacity hover:bg-black/10" />
              </Link>
            ) : (
              <>
                <Image
                  src={activeSliders[0].image}
                  alt={activeSliders[0].title}
                  fill
                  className="object-cover object-center"
                  priority
                  unoptimized
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </>
            )}
          </div>
        ) : (
          <div className="container relative px-4 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm md:text-5xl">
                Welcome to Tech Pinik
              </h1>
              <p className="mt-4 text-lg text-emerald-100/90">
                Bangladesh&apos;s trusted e-commerce — shop with confidence. 
                Fast delivery across Dhaka and nationwide.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50">
                  <Link href="/products">Shop now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  <Link href="/products">Browse products</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Trust strip */}
      <section className="border-b bg-muted/50">
        <div className="container px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="size-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Fast delivery</p>
                <p className="text-sm">Inside Dhaka ৳65 · Outside ৳110</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shield className="size-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Secure & easy</p>
                <p className="text-sm">Order with phone & address only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container px-4 py-16 md:py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Picked for you
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Featured products
            </h2>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href="/products" className="gap-2">
              View all products
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 py-20 text-center">
            <p className="text-muted-foreground">No featured products yet.</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/products">Browse all products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 8).map((p) => (
              <Link
                key={p._id.toString()}
                href={`/products/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary/20 hover:shadow-lg"
              >
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
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    Featured
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-semibold leading-snug line-clamp-2 group-hover:text-primary">
                    {p.name}
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    ৳{p.price.toLocaleString()}
                  </p>
                  <span className="mt-auto pt-2 text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-muted/40 py-16 md:py-20">
          <div className="container px-4">
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Explore
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Shop by category
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((c) => (
                <Link
                  key={c._id.toString()}
                  href={`/products?category=${encodeURIComponent(c.slug)}`}
                  className="group relative flex overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary/30 hover:shadow-md"
                >
                  {c.image ? (
                    <div className="relative aspect-4/3 w-full">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-semibold text-white drop-shadow">
                          {c.name}
                        </p>
                        <span className="text-sm text-white/90">Shop now →</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-between p-6">
                      <p className="font-semibold">{c.name}</p>
                      <span className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground">
                        →
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container px-4 py-16 md:py-20">
        <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-12 md:py-16">
          <h2 className="text-2xl font-bold md:text-3xl">
            Ready to order?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-primary-foreground/90">
            No account needed. Add to cart, checkout with your phone & address, and we&apos;ll deliver.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link href="/products">Start shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
