import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BrowseList, type BrowseItem } from "@/components/browse/browse-list";
import { countries, excludedCountries } from "@/data/countries";
import { imageFor } from "@/data/images";

export const metadata: Metadata = {
  title: "Browse every dish",
  description:
    "Every country in the pool and its one signature dish, grouped by region, with search and filters.",
  alternates: { canonical: "/browse" },
};

const items: BrowseItem[] = countries.map((c) => {
  const image = imageFor(c.code);
  return {
    code: c.code,
    name: c.name,
    flag: c.flag,
    region: c.region,
    dish: c.dish,
    localName: c.localName,
    method: c.method,
    course: c.course,
    difficulty: c.difficulty,
    minutes: c.minutes,
    thumb: image
      ? { url: image.thumbUrl, width: image.thumbWidth, height: image.thumbHeight }
      : null,
  };
});

export default function BrowsePage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Browse every dish</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {countries.length} countries, one dish each. {excludedCountries.length} more
          are{" "}
          <Link href="/criteria#left-out" className="underline underline-offset-4 hover:text-foreground">
            left out, with reasons
          </Link>
          .
        </p>
      </header>
      {/* Reads the filters from the URL, so it renders behind Suspense. */}
      <Suspense fallback={<p className="text-muted-foreground">Loading the list…</p>}>
        <BrowseList items={items} />
      </Suspense>
    </div>
  );
}
