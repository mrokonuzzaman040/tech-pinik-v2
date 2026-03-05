"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import type { Product, ProductSpec } from "@/lib/collections/products";
import type { Category } from "@/lib/collections/categories";
import { Plus, Trash2 } from "lucide-react";

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
  const [sku, setSku] = useState(product?.sku ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [model, setModel] = useState(product?.model ?? "");
  const [warranty, setWarranty] = useState(product?.warranty ?? "");
  const [color, setColor] = useState(product?.color ?? "");
  const [compatibility, setCompatibility] = useState(product?.compatibility ?? "");
  const [connectivity, setConnectivity] = useState(product?.connectivity ?? "");
  const [specifications, setSpecifications] = useState<ProductSpec[]>(
    product?.specifications?.length ? [...product.specifications] : []
  );
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

  function addSpec() {
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  }

  function updateSpec(index: number, field: "key" | "value", value: string) {
    setSpecifications((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function removeSpec(index: number) {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
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
          sku: sku.trim() || undefined,
          brand: brand.trim() || undefined,
          model: model.trim() || undefined,
          warranty: warranty.trim() || undefined,
          color: color.trim() || undefined,
          compatibility: compatibility.trim() || undefined,
          connectivity: connectivity.trim() || undefined,
          specifications: specifications
            .filter((s) => s.key.trim() && s.value.trim())
            .map((s) => ({ key: s.key.trim(), value: s.value.trim() })),
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
    <form onSubmit={onSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Basic info</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
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
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. ELEC-001"
            />
          </div>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Pricing & category</h2>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Product details (Electronics & accessories)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Samsung, Apple"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Black, White"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="warranty">Warranty</Label>
            <Input
              id="warranty"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder="e.g. 1 year"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="compatibility">Compatibility</Label>
          <Input
            id="compatibility"
            value={compatibility}
            onChange={(e) => setCompatibility(e.target.value)}
            placeholder="e.g. iPhone 12–15, Android"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="connectivity">Connectivity</Label>
          <Input
            id="connectivity"
            value={connectivity}
            onChange={(e) => setConnectivity(e.target.value)}
            placeholder="e.g. Bluetooth 5.0, USB-C"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Images</h2>
        <div className="flex flex-wrap gap-4">
          {images.map((url, i) => (
            <div key={i} className="relative">
              <div className="relative h-24 w-24 overflow-hidden rounded border bg-muted">
                <Image src={url} alt="" fill className="object-cover" unoptimized />
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
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Specifications</h2>
        <p className="text-sm text-muted-foreground">Add key-value pairs (e.g. Battery: 5000mAh, Screen: 6.5&quot;)</p>
        <div className="space-y-2">
          {specifications.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Key"
                value={spec.key}
                onChange={(e) => updateSpec(i, "key", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value"
                value={spec.value}
                onChange={(e) => updateSpec(i, "value", e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon" onClick={() => removeSpec(i)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addSpec}>
            <Plus className="mr-2 size-4" />
            Add specification
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Inventory & display</h2>
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
            <Label htmlFor="order">Display order</Label>
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
          <Label htmlFor="featured">Featured on homepage</Label>
        </div>
      </section>

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
