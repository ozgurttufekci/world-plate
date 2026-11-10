import type { Metadata } from "next";
import Link from "next/link";
import { countries } from "@/data/countries";
import { images } from "@/data/images";
import { countryPath } from "@/lib/format";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Authors and licences of the dish photos, all from Wikimedia Commons.",
  alternates: { canonical: "/credits" },
};

const link = "underline underline-offset-4 hover:text-foreground";

export default function CreditsPage() {
  const withPhoto = countries.filter((c) => images[c.code]);
  const without = countries.filter((c) => !images[c.code]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Photo credits</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The {withPhoto.length} dish photos are the lead images of each dish&apos;s
          English Wikipedia article, hosted on Wikimedia Commons under free licences. They
          are shown unmodified apart from resizing. Each links to its file page, where the
          full licence terms are.
        </p>
      </header>

      <ul className="divide-y rounded-2xl border bg-card">
        {withPhoto.map((c) => {
          const image = images[c.code];
          return (
            <li key={c.code} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[16rem_1fr] sm:gap-4">
              <p>
                <Link href={countryPath(c.code)} className="font-medium hover:underline">
                  {c.dish}
                </Link>
                <span className="block text-muted-foreground">
                  <span aria-hidden>{c.flag}</span> {c.name}
                </span>
              </p>
              <p className="text-muted-foreground">
                <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  {image.author}
                </a>
                ,{" "}
                {image.licenseUrl ? (
                  <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer" className={link}>
                    {image.license}
                  </a>
                ) : (
                  image.license
                )}
              </p>
            </li>
          );
        })}
      </ul>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">Dishes without a photo ({without.length})</h2>
        <p className="leading-relaxed text-muted-foreground">
          These show the country&apos;s flag instead, because the dish has no Wikipedia
          article of its own, the article has no usable image, or its image shows a
          different dish:
        </p>
        <p className="leading-relaxed">
          {without.map((c, i) => (
            <span key={c.code}>
              {i > 0 && ", "}
              <Link href={countryPath(c.code)} className={link}>
                {c.dish}
              </Link>{" "}
              ({c.name})
            </span>
          ))}
          .
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">Other sources</h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 leading-relaxed text-muted-foreground">
          <li>
            Globe shapes:{" "}
            <a href="https://github.com/topojson/world-atlas" target="_blank" rel="noopener noreferrer" className={link}>
              world-atlas
            </a>
            , built from Natural Earth (public domain).
          </li>
          <li>
            Country names, regions and coordinates:{" "}
            <a href="https://github.com/mledoze/countries" target="_blank" rel="noopener noreferrer" className={link}>
              mledoze/countries
            </a>{" "}
            (ODbL).
          </li>
          <li>
            Dish background links go to{" "}
            <a href="https://en.wikipedia.org" target="_blank" rel="noopener noreferrer" className={link}>
              Wikipedia
            </a>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}
