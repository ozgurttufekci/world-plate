import Link from "next/link";
import { SpinResult } from "@/components/spin/spin-result";
import { countries, excludedCountries } from "@/data/countries";

export default function HomePage() {
  return (
    <SpinResult code={null}>
      <section className="flex flex-col gap-6 lg:pt-8">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Spin the globe. Cook what it lands on.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Every country here has exactly one dish, and no dish belongs to two countries.
          Spin, and you get a country and the thing to make from it. Use the filters if
          you only want to bake, only have an hour, or want dessert.
        </p>
        <ol className="grid max-w-2xl gap-3 sm:grid-cols-3">
          {[
            ["1", "Spin", "A country is picked at random from the ones that match your filters."],
            ["2", "Read", "See its dish, why it was chosen, and how long it takes."],
            ["3", "Cook", "Follow the recipe link, then mark it as made."],
          ].map(([n, title, text]) => (
            <li key={n} className="rounded-2xl border bg-card p-4">
              <p className="text-sm font-medium text-primary">Step {n}</p>
              <p className="mt-1 font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {countries.length} countries are in the pool. The other{" "}
          {excludedCountries.length} candidates are left out, each with a reason;{" "}
          <Link href="/criteria" className="underline underline-offset-4 hover:text-foreground">
            see the rules and the list
          </Link>
          . Or{" "}
          <Link href="/browse" className="underline underline-offset-4 hover:text-foreground">
            browse every dish
          </Link>
          .
        </p>
      </section>
    </SpinResult>
  );
}
