/**
 * Writes src/data/geo.json: name, numeric code, region and coordinates for every
 * candidate country (UN members and the Vatican, plus Palestine, Taiwan and Kosovo).
 *
 * Run by hand with `pnpm data:geo` when the candidate list needs to change.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import countries from "world-countries";
import type { Geo, Region } from "../src/data/schema";

const EXTRA_CANDIDATES = new Set(["PS", "TW", "XK"]);

/** Where the package's short name differs from the one the country uses in English. */
const NAME_OVERRIDES: Record<string, string> = {
  CI: "Côte d'Ivoire",
  CV: "Cabo Verde",
};

function regionOf(region: string, subregion: string): Region {
  if (region === "Americas") {
    return subregion === "South America" ? "South America" : "North America";
  }
  if (
    region === "Africa" ||
    region === "Asia" ||
    region === "Europe" ||
    region === "Oceania"
  ) {
    return region;
  }
  throw new Error(`Unexpected region: ${region}`);
}

const geo: Geo[] = countries
  .filter((c) => c.unMember || EXTRA_CANDIDATES.has(c.cca2))
  .map((c) => ({
    code: c.cca2,
    name: NAME_OVERRIDES[c.cca2] ?? c.name.common,
    numeric: c.ccn3 || null,
    region: regionOf(c.region, c.subregion),
    lat: c.latlng[0],
    lng: c.latlng[1],
  }))
  .sort((a, b) => a.code.localeCompare(b.code));

const out = fileURLToPath(new URL("../src/data/geo.json", import.meta.url));
writeFileSync(out, JSON.stringify(geo, null, 2) + "\n");
console.log(`Wrote ${geo.length} candidate countries to ${out}`);
