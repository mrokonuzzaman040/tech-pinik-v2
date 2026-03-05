import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/30 p-8">
      <h1 className="text-3xl font-semibold">Tech Pinik</h1>
      <p className="text-muted-foreground">Bangladesh E-commerce</p>
      <div className="flex gap-4">
        <Link
          href="/order"
          className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
        >
          Place order
        </Link>
        <Link
          href="/admin"
          className="rounded-md border border-input bg-background px-6 py-3 hover:bg-muted"
        >
          Admin panel
        </Link>
      </div>
    </div>
  );
}
