import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-start gap-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Nothing on this plate</h1>
      <p className="text-muted-foreground">
        That page doesn&apos;t exist, or that country isn&apos;t in the pool.
      </p>
      <div className="flex gap-2">
        <Link href="/" className={buttonVariants({ variant: "default", size: "lg" })}>
          Spin the globe
        </Link>
        <Link href="/browse" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Browse all dishes
        </Link>
      </div>
    </section>
  );
}
