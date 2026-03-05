import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/collections/products";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductGallery } from "./product-gallery";
import { ChevronRight } from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="container px-4 py-8 md:py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-4" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="size-4" />
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="flex flex-col">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-bold text-primary">
              ৳{product.price.toLocaleString()}
            </p>
            <div className="mt-4">
              {product.stock <= 0 ? (
                <p className="font-medium text-destructive">Out of stock</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  In stock: {product.stock} units
                </p>
              )}
            </div>
            {product.description && (
              <div className="mt-6 border-t border-border pt-6">
                <h2 className="font-semibold">Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}
            <div className="mt-8 border-t border-border pt-6">
              <AddToCartButton
                productId={product._id.toString()}
                name={product.name}
                price={product.price}
                image={product.images[0]}
                slug={product.slug}
                disabled={product.stock <= 0}
              />
            </div>
          </div>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}
