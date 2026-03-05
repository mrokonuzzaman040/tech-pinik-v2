import Link from "next/link";
import type { Category } from "@/lib/collections/categories";

function buildQuery(params: {
  category?: string;
  brand?: string;
  q?: string;
}) {
  const p = new URLSearchParams();
  if (params.category) p.set("category", params.category);
  if (params.brand) p.set("brand", params.brand);
  if (params.q) p.set("q", params.q);
  const s = p.toString();
  return s ? `?${s}` : "";
}

type ProductsFiltersProps = {
  categories: Category[];
  categorySlug?: string;
  brands: string[];
  brandFilter?: string;
  searchQuery?: string;
};

export function ProductsFilters({
  categories,
  categorySlug,
  brands,
  brandFilter,
  searchQuery,
}: ProductsFiltersProps) {
  const baseQuery = { category: categorySlug, brand: brandFilter, q: searchQuery };

  return (
    <div className="mb-10 space-y-6">
      <form
        method="GET"
        action="/products"
        className="flex flex-wrap items-center gap-2"
      >
        {categorySlug && (
          <input type="hidden" name="category" value={categorySlug} />
        )}
        {brandFilter && (
          <input type="hidden" name="brand" value={brandFilter} />
        )}
        <input
          type="search"
          name="q"
          defaultValue={searchQuery}
          placeholder="Search by name, SKU, brand, model…"
          className="h-10 max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Search
        </button>
        {(searchQuery || categorySlug || brandFilter) && (
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Link>
        )}
      </form>

      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/products${buildQuery({ ...baseQuery, category: undefined })}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                !categorySlug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id.toString()}
                href={`/products${buildQuery({ ...baseQuery, category: c.slug })}`}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  categorySlug === c.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Brand
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/products${buildQuery({ ...baseQuery, brand: undefined })}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                !brandFilter
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              All brands
            </Link>
            {brands.map((b) => (
              <Link
                key={b}
                href={`/products${buildQuery({ ...baseQuery, brand: b })}`}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  brandFilter === b
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {b}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
