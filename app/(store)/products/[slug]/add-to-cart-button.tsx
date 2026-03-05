"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context";

type Props = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  slug,
  disabled,
}: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId,
      name,
      price,
      quantity,
      image,
      slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="qty" className="text-sm font-medium">
          Quantity
        </label>
        <Input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          className="w-20"
        />
      </div>
      <Button onClick={handleAdd} disabled={disabled}>
        {added ? "Added to cart" : "Add to cart"}
      </Button>
    </div>
  );
}
