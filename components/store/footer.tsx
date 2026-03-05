import Link from "next/link";
import { Truck } from "lucide-react";

export function StoreFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-[var(--footer)] mt-auto">
      <div className="container px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-semibold">
              Tech Pinik
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Bangladesh&apos;s trusted e-commerce. Shop with confidence.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Quick links</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-sm text-muted-foreground hover:text-foreground">
                  Checkout
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Delivery</h3>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4 shrink-0 text-primary" />
              <span>Inside Dhaka ৳65 · Outside Dhaka ৳110</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          © {currentYear} Tech Pinik. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
