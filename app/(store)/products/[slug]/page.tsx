import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/collections/products";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "./add-to-cart-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="container px-4 py-12">
      <div className="mb-6">
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to products
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.slice(1, 5).map((src, i) => (
                <div
                  key={i}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded border"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-primary">
            ৳{product.price.toLocaleString()}
          </p>
          {product.stock <= 0 ? (
            <p className="mt-2 text-muted-foreground">Out of stock</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              In stock: {product.stock}
            </p>
          )}
          {product.description && (
            <div className="mt-6">
              <h2 className="font-medium">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}
          <div className="mt-8">
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
      </div>
    </div>
  );
}
