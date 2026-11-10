import geoJson from "./geo.json";
import { africa } from "./dishes/africa";
import { americas } from "./dishes/americas";
import { asia } from "./dishes/asia";
import { europe } from "./dishes/europe";
import { oceania } from "./dishes/oceania";
import { excluded } from "./excluded";
import { flagOf } from "../lib/format";
import type { Country, DishEntry, ExcludedEntry, Geo } from "./schema";

export const geo = geoJson as Geo[];
export const geoByCode: ReadonlyMap<string, Geo> = new Map(
  geo.map((g) => [g.code, g]),
);

export const dishEntries: DishEntry[] = [
  ...africa,
  ...asia,
  ...europe,
  ...americas,
  ...oceania,
];

export const countries: Country[] = dishEntries
  .map(({ code, ...dish }) => {
    const g = geoByCode.get(code);
    if (!g) throw new Error(`No geo data for country code ${code}`);
    return { ...g, ...dish, flag: flagOf(code) };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const countryByCode: ReadonlyMap<string, Country> = new Map(
  countries.map((c) => [c.code, c]),
);

/** Looks up a country from a URL segment, which is the lower-case code. */
export function findCountry(segment: string): Country | undefined {
  return countryByCode.get(segment.toUpperCase());
}

export interface ExcludedCountry extends ExcludedEntry {
  name: string;
  region: Geo["region"];
  flag: string;
}

export const excludedCountries: ExcludedCountry[] = excluded
  .map((e) => {
    const g = geoByCode.get(e.code);
    if (!g) throw new Error(`No geo data for excluded code ${e.code}`);
    return { ...e, name: g.name, region: g.region, flag: flagOf(e.code) };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
