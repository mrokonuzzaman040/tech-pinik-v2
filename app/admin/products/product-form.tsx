"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/lib/collections/products";
import type { Category } from "@/lib/collections/categories";
import { ImageUpload } from "@/components/admin/image-upload";

type ProductFormProps = {
  product?: Product;
  categories: Category[];
};

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [order, setOrder] = useState(product?.order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function slugFromName(value: string) {
    return value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!product) setSlug(slugFromName(value));
  }

  function addImage(url: string) {
    setImages((prev) => [...prev, url]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = product
        ? `/api/admin/products/${product._id.toString()}`
        : "/api/admin/products";
      const method = product ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          price: Number(price),
          categoryId,
          images,
          stock: Number(stock) || 0,
          featured,
          order: Number(order) || 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (BDT)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={1}
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c._id.toString()} value={c._id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Images</Label>
        <div className="flex flex-wrap gap-4">
          {images.map((url, i) => (
            <div key={i} className="relative">
              <div className="relative h-24 w-24 overflow-hidden rounded border bg-muted">
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 size-6"
                onClick={() => removeImage(i)}
              >
                ×
              </Button>
            </div>
          ))}
          <ProductImageAdd onAdd={addImage} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="featured"
          checked={featured}
          onCheckedChange={(v) => setFeatured(Boolean(v))}
        />
        <Label htmlFor="featured">Featured</Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : product ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/products">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

function ProductImageAdd({ onAdd }: { onAdd: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "products");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) onAdd(data.url);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="size-24"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "…" : "+"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </>
  );
}
