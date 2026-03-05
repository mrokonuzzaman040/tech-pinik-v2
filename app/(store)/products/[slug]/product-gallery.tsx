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
  const hasMultiple = displayImages.length > 1;

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
          alt={hasMultiple ? `${name} – image ${mainIndex + 1} of ${displayImages.length}` : name}
          fill
          className="object-cover"
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {hasMultiple && (
          <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
            {mainIndex + 1} / {displayImages.length}
          </span>
        )}
      </div>
      {hasMultiple && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            All images ({displayImages.length})
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {displayImages.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMainIndex(i)}
                className={`relative block h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  i === mainIndex
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="relative block h-full w-full">
                  <Image
                    src={src}
                    alt={`${name} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="80px"
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
