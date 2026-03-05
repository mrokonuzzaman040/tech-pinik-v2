"use client";

import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "./cart-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type CategoryLink = { id: string; name: string; slug: string };

export function StoreHeader({
  categoryLinks = [],
}: {
  categoryLinks?: CategoryLink[];
}) {

  const nav = (
    <>
      <Link
        href="/"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Home
      </Link>
      <Link
        href="/products"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Products
      </Link>
      {categoryLinks.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Categories
              <ChevronDown className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {categoryLinks.map((c) => (
              <DropdownMenuItem key={c.id} asChild>
                <Link href={`/products?category=${c.slug}`}>{c.name}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <Link href="/products">View all</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold text-foreground"
        >
          Tech Pinik
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{nav}</nav>

        <div className="flex items-center gap-2">
          <CartSheet />
          <Link href="/admin" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Products
                </Link>
                {categoryLinks.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${c.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
