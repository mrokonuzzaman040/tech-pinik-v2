"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Slider } from "@/lib/collections/sliders";
import { ImageUpload } from "@/components/admin/image-upload";

export function SliderForm({ slider }: { slider?: Slider }) {
  const router = useRouter();
  const [title, setTitle] = useState(slider?.title ?? "");
  const [image, setImage] = useState(slider?.image ?? "");
  const [link, setLink] = useState(slider?.link ?? "");
  const [order, setOrder] = useState(slider?.order ?? 0);
  const [active, setActive] = useState(slider?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = slider
        ? `/api/admin/sliders/${slider._id.toString()}`
        : "/api/admin/sliders";
      const method = slider ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          image,
          link: link || undefined,
          order: Number(order) || 0,
          active,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to save");
        return;
      }
      router.push("/admin/sliders");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Image</Label>
        <ImageUpload value={image} onChange={setImage} folder="sliders" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="link">Link (optional)</Label>
        <Input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://"
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
      <div className="flex items-center gap-2">
        <Checkbox
          id="active"
          checked={active}
          onCheckedChange={(v) => setActive(Boolean(v))}
        />
        <Label htmlFor="active">Active</Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : slider ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/sliders">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
