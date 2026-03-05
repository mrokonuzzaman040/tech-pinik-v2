"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const displayImages = images.length > 0 ? images : [];
  const mainSrc = displayImages[mainIndex];

  if (displayImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src={mainSrc}
          alt={name}
          fill
          className="object-cover"
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMainIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === mainIndex
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                unoptimized
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
