"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/collections/categories";
import { ImageUpload } from "@/components/admin/image-upload";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [order, setOrder] = useState(category?.order ?? 0);
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
    if (!category) setSlug(slugFromName(value));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = category
        ? `/api/admin/categories/${category._id.toString()}`
        : "/api/admin/categories";
      const method = category ? "PATCH" : "POST";
      const body = { name, slug, image: image || undefined, order };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
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
        <Label>Image</Label>
        <ImageUpload value={image} onChange={setImage} folder="categories" />
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
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : category ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/categories">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
