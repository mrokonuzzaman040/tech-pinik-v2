"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const THUMBNAILS_VISIBLE = 4;

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const displayImages = images.length > 0 ? images : [];
  const mainSrc = displayImages[mainIndex];
  const hasMultiple = displayImages.length > 1;

  // Keep selected image in view when scrolling thumbnails
  useEffect(() => {
    if (!hasMultiple) return;
    if (mainIndex < thumbStart) setThumbStart(mainIndex);
    if (mainIndex >= thumbStart + THUMBNAILS_VISIBLE) setThumbStart(mainIndex - THUMBNAILS_VISIBLE + 1);
  }, [mainIndex, hasMultiple, thumbStart]);

  const thumbSlice = displayImages.slice(thumbStart, thumbStart + THUMBNAILS_VISIBLE);
  const canScrollUp = hasMultiple && thumbStart > 0;
  const canScrollDown = hasMultiple && thumbStart + THUMBNAILS_VISIBLE < displayImages.length;

  if (displayImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Left: thumbnail strip (4 visible) with arrows */}
      {hasMultiple && (
        <div className="flex shrink-0 flex-col items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-12 rounded-lg"
            onClick={() => setThumbStart((s) => Math.max(0, s - 1))}
            disabled={!canScrollUp}
            aria-label="Previous images"
          >
            <ChevronUp className="size-4" />
          </Button>
          <div className="flex flex-col gap-2">
            {thumbSlice.map((src, idx) => {
              const actualIndex = thumbStart + idx;
              const isSelected = actualIndex === mainIndex;
              return (
                <button
                  key={actualIndex}
                  type="button"
                  onClick={() => setMainIndex(actualIndex)}
                  className={`relative block h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="relative block h-full w-full">
                    <Image
                      src={src}
                      alt={`${name} thumbnail ${actualIndex + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="64px"
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-12 rounded-lg"
            onClick={() =>
              setThumbStart((s) =>
                Math.min(displayImages.length - THUMBNAILS_VISIBLE, s + 1)
              )
            }
            disabled={!canScrollDown}
            aria-label="Next images"
          >
            <ChevronDown className="size-4" />
          </Button>
        </div>
      )}

      {/* Right: main image */}
      <div className="relative min-w-0 flex-1 aspect-square overflow-hidden rounded-xl border border-border bg-muted">
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
    </div>
  );
}
