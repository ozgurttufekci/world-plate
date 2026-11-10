/**
 * Small helpers with no data dependencies, safe to import from client components.
 */

/** Regional-indicator flag emoji for an ISO alpha-2 code. */
export function flagOf(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

export function countryPath(code: string): string {
  return `/country/${code.toLowerCase()}`;
}

export function wikiUrl(title: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}

export function recipeSearchUrl(dish: string, country: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${dish} recipe ${country}`)}`;
}

/** "25 min", "1 h 15 min", "about a day", "about 3 days". */
export function formatMinutes(minutes: number): string {
  if (minutes >= 36 * 60) return `about ${Math.round(minutes / (24 * 60))} days`;
  if (minutes >= 20 * 60) return "about a day";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
