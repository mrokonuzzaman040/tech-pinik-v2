"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function CartSheet() {
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="size-5" />
          {count > 0 && (
            <Badge
              variant="default"
              className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs"
            >
              {count > 99 ? "99+" : count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-hidden">
          {items.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-4 border-b pb-4 last:border-0"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ৳{item.price.toLocaleString()} × {item.quantity}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            Math.max(1, Number(e.target.value) || 1)
                          )
                        }
                        className="h-8 w-16"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <p className="shrink-0 font-medium">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {items.length > 0 && (
            <div className="border-t pt-4">
              <p className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Delivery charge added at checkout.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="/order" onClick={() => setOpen(false)}>
                  Proceed to checkout
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
