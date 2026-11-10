import { ExternalLink, Search } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  COURSE_LABELS,
  DIFFICULTY_LABELS,
  METHOD_LABELS,
  type Country,
  type DishImage,
} from "@/data/schema";
import { formatMinutes, recipeSearchUrl, wikiUrl } from "@/lib/format";
import { cn } from "@/lib/utils";
import { MadeToggle, ShareButton } from "./dish-actions";

function Photo({ country, image }: { country: Country; image: DishImage | undefined }) {
  if (!image) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center bg-muted">
        <span className="text-7xl" role="img" aria-label={`Flag of ${country.name}`}>
          {country.flag}
        </span>
      </div>
    );
  }
  return (
    <figure>
      <div className="relative aspect-[16/10] w-full bg-muted">
        <Image
          src={image.url}
          alt={`${country.dish}, a dish from ${country.name}`}
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover"
          // Served by Wikimedia's own thumbnailer; no need to re-encode it.
          unoptimized
          priority
        />
      </div>
      <figcaption className="px-5 pt-2 text-xs text-muted-foreground sm:px-7">
        Photo:{" "}
        <a
          href={image.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {image.author}
        </a>
        ,{" "}
        {image.licenseUrl ? (
          <a
            href={image.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {image.license}
          </a>
        ) : (
          image.license
        )}
        , via Wikimedia Commons
      </figcaption>
    </figure>
  );
}

export function DishCard({
  country,
  image,
}: {
  country: Country;
  image: DishImage | undefined;
}) {
  const linkClass = cn(
    buttonVariants({ variant: "outline" }),
    "h-10 gap-2 rounded-full px-4",
  );
  return (
    <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <Photo country={country} image={image} />
      <div className="flex flex-col gap-5 p-5 sm:p-7">
        <header>
          <p className="text-sm font-medium text-muted-foreground">
            <span className="mr-1.5">{country.flag}</span>
            {country.name} · {country.region}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {country.dish}
          </h1>
          {country.localName && (
            <p className="mt-1 text-muted-foreground">also {country.localName}</p>
          )}
        </header>

        <ul className="flex flex-wrap gap-1.5" aria-label="Details">
          <li>
            <Badge variant="secondary" className="h-6 px-2.5 text-sm">
              {METHOD_LABELS[country.method]}
            </Badge>
          </li>
          <li>
            <Badge variant="secondary" className="h-6 px-2.5 text-sm">
              {COURSE_LABELS[country.course]}
            </Badge>
          </li>
          <li>
            <Badge variant="secondary" className="h-6 px-2.5 text-sm">
              {DIFFICULTY_LABELS[country.difficulty]}
            </Badge>
          </li>
          <li>
            <Badge
              variant="secondary"
              className="h-6 px-2.5 text-sm"
              title="Start to finish, including soaking, marinating, proofing and chilling"
            >
              {formatMinutes(country.minutes)}
            </Badge>
          </li>
        </ul>

        <p className="text-lg leading-relaxed text-pretty">{country.description}</p>

        <div className="rounded-2xl bg-muted px-4 py-3">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Why this dish
          </h2>
          <p className="mt-1 leading-relaxed text-pretty">{country.whyUnique}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={recipeSearchUrl(country.dish, country.name)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-10 gap-2 rounded-full px-4",
            )}
          >
            <Search aria-hidden />
            Find a recipe
          </a>
          {country.wiki && (
            <a
              href={wikiUrl(country.wiki)}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <ExternalLink aria-hidden />
              Wikipedia
            </a>
          )}
          <MadeToggle code={country.code} dish={country.dish} />
          <ShareButton
            code={country.code}
            title={`${country.dish} from ${country.name}`}
          />
        </div>
      </div>
    </article>
  );
}
