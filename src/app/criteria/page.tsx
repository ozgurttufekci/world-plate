import type { Metadata } from "next";
import Link from "next/link";
import { countries, excludedCountries, geo } from "@/data/countries";
import { EXCLUSION_KINDS, EXCLUSION_KIND_LABELS } from "@/data/schema";

export const metadata: Metadata = {
  title: "How countries are chosen",
  description:
    "The rules for which countries are in the pool, how each dish was picked, and the countries left out with reasons.",
  alternates: { canonical: "/criteria" },
};

export default function CriteriaPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          How countries are chosen
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {countries.length} of {geo.length} candidate countries are in the pool. Each has
          one fixed dish, so the only random part of a spin is the country.
        </p>
      </header>

      <section className="flex flex-col gap-3 leading-relaxed">
        <h2 className="text-xl font-semibold tracking-tight">The rules</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong>Candidates</strong> are the 193 UN member states plus the Vatican,
            Palestine, Taiwan and Kosovo. Territories and regions inside countries are not
            candidates.
          </li>
          <li>
            A country is in the pool if it has <strong>at least one dish that is
            distinctly its own</strong>. A national version of a wider family counts, as
            long as it is recognisably that country&apos;s. Those cases say so on the dish
            page.
          </li>
          <li>
            <strong>A dish belongs to one country only.</strong> When two countries have
            the same signature dish, one of them gets a different dish, or is left out if
            it has no other candidate.
          </li>
          <li>
            <strong>Contested dishes are avoided</strong> where a country has an
            uncontested alternative. That is why you won&apos;t find hummus, jollof rice,
            borscht, couscous or pavlova here.
          </li>
          <li>
            Where a country has several equally good candidates, the pick leans towards{" "}
            <strong>baking, desserts, breads, drinks and no-cook dishes</strong>, so those
            filters have enough to choose from.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3 leading-relaxed">
        <h2 className="text-xl font-semibold tracking-tight">What to keep in mind</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            The list was written from general knowledge and checked against Wikipedia, not
            against a culinary authority. Every dish page explains the choice, so you can
            disagree with it.
          </li>
          <li>
            Being left out says something about this dataset, not about a country&apos;s
            food.
          </li>
          <li>
            Times run from start to finish and include soaking, marinating, proofing and
            chilling. Difficulty is a rough judgement for a home kitchen.
          </li>
          <li>
            Photos come from Wikimedia Commons. A few dishes have none; see the{" "}
            <Link href="/credits" className="underline underline-offset-4">
              photo credits
            </Link>
            .
          </li>
        </ul>
      </section>

      <section id="left-out" className="flex scroll-mt-6 flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Left out ({excludedCountries.length})
          </h2>
          <p className="mt-1 text-muted-foreground">
            Every candidate that is not in the pool, and why.
          </p>
        </div>
        {EXCLUSION_KINDS.map((kind) => {
          const rows = excludedCountries.filter((e) => e.kind === kind);
          if (rows.length === 0) return null;
          return (
            <div key={kind}>
              <h3 className="mb-2 font-semibold">
                {EXCLUSION_KIND_LABELS[kind]}{" "}
                <span className="font-normal text-muted-foreground">{rows.length}</span>
              </h3>
              <ul className="divide-y rounded-2xl border bg-card">
                {rows.map((e) => (
                  <li key={e.code} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                    <p className="font-medium">
                      <span className="mr-1.5" aria-hidden>
                        {e.flag}
                      </span>
                      {e.name}
                      <span className="block text-sm font-normal text-muted-foreground">
                        {e.region}
                      </span>
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{e.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}
