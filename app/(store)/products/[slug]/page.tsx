import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/collections/products";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductGallery } from "./product-gallery";
import { ChevronRight, Package, Wrench } from "lucide-react";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="flex flex-wrap gap-2 py-2 border-b border-border last:border-0">
      <span className="text-sm font-medium text-muted-foreground shrink-0">
        {label}:
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const hasDetails =
    product.sku ||
    product.brand ||
    product.model ||
    product.warranty ||
    product.color ||
    product.compatibility ||
    product.connectivity;
  const hasSpecs = product.specifications?.length;

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

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            {product.sku && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                SKU: {product.sku}
              </p>
            )}
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl mt-1">
              {product.name}
            </h1>
            {product.brand && (
              <p className="mt-2 text-sm text-muted-foreground">
                Brand: <span className="font-medium text-foreground">{product.brand}</span>
              </p>
            )}
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

          {hasDetails && (
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="font-semibold flex items-center gap-2">
                <Package className="size-4 text-primary" />
                Product details
              </h2>
              <div className="mt-4">
                <DetailRow label="Brand" value={product.brand} />
                <DetailRow label="Model" value={product.model} />
                <DetailRow label="Color" value={product.color} />
                <DetailRow label="Warranty" value={product.warranty} />
                <DetailRow label="Compatibility" value={product.compatibility} />
                <DetailRow label="Connectivity" value={product.connectivity} />
              </div>
            </div>
          )}

          {hasSpecs && (
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="font-semibold flex items-center gap-2">
                <Wrench className="size-4 text-primary" />
                Specifications
              </h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications!.map((spec, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0 even:bg-muted/30"
                      >
                        <td className="py-3 px-4 font-medium text-muted-foreground w-1/3">
                          {spec.key}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}
