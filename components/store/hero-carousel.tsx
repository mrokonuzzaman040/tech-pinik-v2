"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type HeroSlide = {
  title: string;
  image: string;
  link?: string;
};

const ROTATE_MS = 5000;

export function HeroCarousel({ sliders }: { sliders: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const n = sliders.length;

  const go = useCallback(
    (next: number) => {
      setIndex((i) => (next < 0 ? (i + n - 1) % n : (i + next) % n));
    },
    [n]
  );

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => go(1), ROTATE_MS);
    return () => clearInterval(id);
  }, [n, go]);

  if (n === 0) return null;

  const slide = sliders[index];

  return (
    <section className="relative w-full overflow-hidden bg-muted">
      <div className="relative aspect-21/9 min-h-[280px] w-full md:aspect-3/1 md:min-h-[320px]">
        {slide.link ? (
          <Link href={slide.link} className="block h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority
              unoptimized
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity hover:bg-black/10" />
          </Link>
        ) : (
          <>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority
              unoptimized
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </>
        )}

        {n > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full opacity-90 hover:opacity-100 md:left-4"
              onClick={() => go(-1)}
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full opacity-90 hover:opacity-100 md:right-4"
              onClick={() => go(1)}
              aria-label="Next slide"
            >
              <ChevronRight className="size-5" />
            </Button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`size-2 rounded-full transition-all ${
                    i === index
                      ? "bg-primary-foreground w-6"
                      : "bg-primary-foreground/50 hover:bg-primary-foreground/80"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
