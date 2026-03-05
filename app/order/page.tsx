import { getProducts } from "@/lib/collections/products";
import { OrderForm } from "./order-form";

export default async function OrderPage() {
  const products = await getProducts();
  const productList = products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    price: p.price,
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Place order</h1>
      <p className="mb-6 text-muted-foreground">
        No account needed. Fill in your details and choose delivery zone.
      </p>
      <OrderForm products={productList} />
    </div>
  );
}
