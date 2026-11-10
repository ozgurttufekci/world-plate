/**
 * Writes src/data/images.json: one photo per dish, taken from the lead image of
 * the dish's English Wikipedia article.
 *
 * A photo is kept only if the file is hosted on Wikimedia Commons (so it is under
 * a free licence) and is a raster image. Everything else is reported and skipped.
 *
 * Run by hand with `pnpm data:images`; the output is committed, so builds never
 * touch the network.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dishEntries, geoByCode } from "../src/data/countries";
import type { DishImage } from "../src/data/schema";

const API = "https://en.wikipedia.org/w/api.php";
const USER_AGENT =
  "world-plate/0.1 (https://github.com/ozgurttufekci/world-plate; dish photo lookup)";
const FULL_WIDTH = 960;
const THUMB_WIDTH = 330;
const BATCH = 40;
const RASTER = new Set(["image/jpeg", "image/png", "image/webp"]);

interface ApiPage {
  title: string;
  missing?: boolean;
  pageimage?: string;
  imagerepository?: string;
  imageinfo?: {
    thumburl?: string;
    thumbwidth?: number;
    thumbheight?: number;
    descriptionurl?: string;
    mime?: string;
    extmetadata?: Record<string, { value: string } | undefined>;
  }[];
}

interface ApiResponse {
  query?: {
    normalized?: { from: string; to: string }[];
    redirects?: { from: string; to: string }[];
    pages?: ApiPage[];
  };
}

async function api(params: Record<string, string>): Promise<ApiResponse> {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    ...params,
  }).toString();
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status} for ${url}`);
  return (await res.json()) as ApiResponse;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Maps each requested title to the page the API resolved it to. */
function resolver(res: ApiResponse) {
  const normalized = new Map(res.query?.normalized?.map((n) => [n.from, n.to]));
  const redirects = new Map(res.query?.redirects?.map((r) => [r.from, r.to]));
  const pages = new Map(res.query?.pages?.map((p) => [p.title, p]));
  return (title: string) => {
    const n = normalized.get(title) ?? title;
    const final = redirects.get(n) ?? n;
    return { final, page: pages.get(final) };
  };
}

function plainText(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function leadImages(titles: string[]) {
  const out = new Map<string, { final: string; file?: string; missing: boolean }>();
  for (const batch of chunk(titles, BATCH)) {
    const res = await api({
      redirects: "1",
      prop: "pageimages",
      piprop: "name",
      titles: batch.join("|"),
    });
    const resolve = resolver(res);
    for (const t of batch) {
      const { final, page } = resolve(t);
      out.set(t, {
        final,
        file: page?.pageimage,
        missing: !page || page.missing === true,
      });
    }
  }
  return out;
}

async function fileInfo(files: string[], width: number) {
  const out = new Map<string, ApiPage>();
  for (const batch of chunk(files, BATCH)) {
    const titles = batch.map((f) => `File:${f.replace(/_/g, " ")}`);
    const res = await api({
      prop: "imageinfo",
      iiprop: "url|size|mime|extmetadata",
      iiurlwidth: String(width),
      iiextmetadatafilter: "Artist|LicenseShortName|LicenseUrl|Credit",
      titles: titles.join("|"),
    });
    const resolve = resolver(res);
    batch.forEach((f, i) => {
      const { page } = resolve(titles[i]);
      if (page) out.set(f, page);
    });
  }
  return out;
}

async function main() {
  const wanted = dishEntries.filter((d) => d.wiki !== null && d.photo !== false);
  const titles = [...new Set(dishEntries.flatMap((d) => (d.wiki ? [d.wiki] : [])))];
  const lead = await leadImages(titles);

  const problems: string[] = [];
  for (const d of dishEntries) {
    if (!d.wiki) continue;
    const l = lead.get(d.wiki)!;
    if (l.missing) problems.push(`${d.code} ${d.dish}: article "${d.wiki}" does not exist`);
    else if (l.final !== d.wiki)
      problems.push(`${d.code} ${d.dish}: "${d.wiki}" redirects to "${l.final}"`);
  }

  const files = [
    ...new Set(wanted.flatMap((d) => lead.get(d.wiki!)?.file ?? [])),
  ];
  const full = await fileInfo(files, FULL_WIDTH);
  const thumb = await fileInfo(files, THUMB_WIDTH);

  const images: Record<string, DishImage> = {};
  const skipped: string[] = [];
  const kept: string[] = [];

  for (const d of [...wanted].sort((a, b) => a.code.localeCompare(b.code))) {
    const label = `${d.code} ${geoByCode.get(d.code)?.name} / ${d.dish}`;
    const file = lead.get(d.wiki!)?.file;
    if (!file) {
      skipped.push(`${label}: article has no lead image`);
      continue;
    }
    const f = full.get(file);
    const t = thumb.get(file);
    const fi = f?.imageinfo?.[0];
    const ti = t?.imageinfo?.[0];
    if (!f || !fi || !ti || !fi.thumburl || !ti.thumburl) {
      skipped.push(`${label}: no image info for ${file}`);
      continue;
    }
    if (f.imagerepository !== "shared") {
      skipped.push(`${label}: ${file} is not on Wikimedia Commons`);
      continue;
    }
    if (!fi.mime || !RASTER.has(fi.mime)) {
      skipped.push(`${label}: ${file} is ${fi.mime}, not a photo format`);
      continue;
    }
    const meta = fi.extmetadata ?? {};
    const license = plainText(meta.LicenseShortName?.value);
    if (!license) {
      skipped.push(`${label}: ${file} has no licence metadata`);
      continue;
    }
    images[d.code] = {
      url: fi.thumburl,
      width: fi.thumbwidth!,
      height: fi.thumbheight!,
      thumbUrl: ti.thumburl,
      thumbWidth: ti.thumbwidth!,
      thumbHeight: ti.thumbheight!,
      author: (plainText(meta.Artist?.value) || plainText(meta.Credit?.value) || "Unknown author").slice(0, 120),
      license,
      licenseUrl: meta.LicenseUrl?.value ?? null,
      sourceUrl: fi.descriptionurl!,
    };
    kept.push(`${label}: ${file}`);
  }

  const out = fileURLToPath(new URL("../src/data/images.json", import.meta.url));
  writeFileSync(out, JSON.stringify(images, null, 2) + "\n");

  const noPhotoByChoice = dishEntries.filter((d) => d.wiki === null || d.photo === false);
  console.log(`Photos kept: ${kept.length} of ${dishEntries.length} dishes`);
  console.log(kept.map((k) => `  ${k}`).join("\n"));
  console.log(`\nSkipped by the script (${skipped.length}):`);
  console.log(skipped.map((s) => `  ${s}`).join("\n") || "  none");
  console.log(`\nNo photo by choice, photo: false or no article (${noPhotoByChoice.length}):`);
  console.log(noPhotoByChoice.map((d) => `  ${d.code} ${d.dish}`).join("\n"));
  console.log(`\nTitle problems (${problems.length}):`);
  console.log(problems.map((p) => `  ${p}`).join("\n") || "  none");
  if (problems.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
