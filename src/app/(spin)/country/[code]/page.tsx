import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToGlobe, MarkSeen } from "@/components/dish/dish-actions";
import { DishCard } from "@/components/dish/dish-card";
import { SpinResult } from "@/components/spin/spin-result";
import { countries, findCountry } from "@/data/countries";
import { imageFor } from "@/data/images";
import { countryPath } from "@/lib/format";

export function generateStaticParams() {
  return countries.map((c) => ({ code: c.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: PageProps<"/country/[code]">): Promise<Metadata> {
  const { code } = await params;
  const country = findCountry(code);
  if (!country) return { title: "Country not found" };

  const title = `${country.dish} from ${country.name}`;
  const image = imageFor(country.code);
  return {
    title,
    description: country.description,
    alternates: { canonical: countryPath(country.code) },
    openGraph: {
      title,
      description: country.description,
      url: countryPath(country.code),
      // Dishes without a photo fall back to the site-wide card.
      images: image
        ? [{ url: image.url, width: image.width, height: image.height, alt: country.dish }]
        : [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function CountryPage({ params }: PageProps<"/country/[code]">) {
  const { code } = await params;
  const country = findCountry(code);
  if (!country) notFound();

  return (
    <SpinResult code={country.code}>
      <MarkSeen code={country.code} />
      <DishCard country={country} image={imageFor(country.code)} />
      <BackToGlobe />
    </SpinResult>
  );
}
