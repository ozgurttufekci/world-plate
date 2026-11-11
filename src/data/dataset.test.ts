import { describe, expect, it } from "vitest";
import { countries, dishEntries, geo } from "./countries";
import { excluded } from "./excluded";
import { images } from "./images";
import {
  COURSES,
  DIFFICULTIES,
  EXCLUSION_KINDS,
  METHODS,
  REGIONS,
} from "./schema";

const candidateCodes = new Set(geo.map((g) => g.code));
const includedCodes = dishEntries.map((d) => d.code);
const excludedCodes = excluded.map((e) => e.code);

function duplicates(values: string[]): string[] {
  return values.filter((v, i) => values.indexOf(v) !== i);
}

describe("candidate list", () => {
  it("has the 193 UN members plus the Vatican, Palestine, Taiwan and Kosovo", () => {
    expect(geo).toHaveLength(197);
    for (const code of ["VA", "PS", "TW", "XK"]) {
      expect(candidateCodes.has(code)).toBe(true);
    }
  });

  it("gives every candidate a valid region and coordinates", () => {
    for (const g of geo) {
      expect(REGIONS, g.code).toContain(g.region);
      expect(Math.abs(g.lat), g.code).toBeLessThanOrEqual(90);
      expect(Math.abs(g.lng), g.code).toBeLessThanOrEqual(180);
    }
  });
});

describe("included and excluded countries", () => {
  it("use each country code at most once", () => {
    expect(duplicates(includedCodes)).toEqual([]);
    expect(duplicates(excludedCodes)).toEqual([]);
  });

  it("do not overlap", () => {
    const both = includedCodes.filter((c) => excludedCodes.includes(c));
    expect(both).toEqual([]);
  });

  it("together account for every candidate and nothing else", () => {
    const accounted = new Set([...includedCodes, ...excludedCodes]);
    const unaccounted = [...candidateCodes].filter((c) => !accounted.has(c));
    const unknown = [...accounted].filter((c) => !candidateCodes.has(c));
    expect(unaccounted).toEqual([]);
    expect(unknown).toEqual([]);
  });

  it("give every exclusion a known kind and a reason", () => {
    for (const e of excluded) {
      expect(EXCLUSION_KINDS, e.code).toContain(e.kind);
      expect(e.reason.length, e.code).toBeGreaterThan(20);
    }
  });
});

describe("dishes", () => {
  it("assign each dish and each Wikipedia article to one country only", () => {
    expect(duplicates(dishEntries.map((d) => d.dish.toLowerCase()))).toEqual([]);
    const articles = dishEntries.flatMap((d) => (d.wiki ? [d.wiki] : []));
    expect(duplicates(articles)).toEqual([]);
  });

  it("have valid filter values and complete text", () => {
    for (const d of dishEntries) {
      expect(d.code, d.code).toMatch(/^[A-Z]{2}$/);
      expect(METHODS, d.code).toContain(d.method);
      expect(COURSES, d.code).toContain(d.course);
      expect(DIFFICULTIES, d.code).toContain(d.difficulty);
      expect(Number.isInteger(d.minutes) && d.minutes > 0, d.code).toBe(true);
      expect(d.dish.trim(), d.code).toBe(d.dish);
      expect(d.dish.length, d.code).toBeGreaterThan(1);
      expect(d.description.length, d.code).toBeGreaterThan(30);
      expect(d.whyUnique.length, d.code).toBeGreaterThan(15);
      expect(d.description, d.code).toMatch(/[.!?]$/);
      expect(d.whyUnique, d.code).toMatch(/[.!?]$/);
      if (d.localName !== undefined) expect(d.localName, d.code).not.toBe(d.dish);
      if (d.wiki !== null) expect(d.wiki.trim().length, d.code).toBeGreaterThan(0);
    }
  });

  it("join onto geo data for every included country", () => {
    expect(countries).toHaveLength(dishEntries.length);
    for (const c of countries) {
      expect(c.name.length, c.code).toBeGreaterThan(0);
      expect([...c.flag], c.code).toHaveLength(2);
    }
  });

  it("keep most candidates in the pool", () => {
    expect(countries.length).toBeGreaterThanOrEqual(185);
  });

  it("have at least one country for every single filter value", () => {
    for (const m of METHODS) expect(countries.some((c) => c.method === m), m).toBe(true);
    for (const v of COURSES) expect(countries.some((c) => c.course === v), v).toBe(true);
    for (const v of DIFFICULTIES)
      expect(countries.some((c) => c.difficulty === v), v).toBe(true);
    for (const v of REGIONS) expect(countries.some((c) => c.region === v), v).toBe(true);
  });
});

describe("photos", () => {
  it("exist only for included dishes that allow one", () => {
    const allowed = new Set(
      dishEntries.filter((d) => d.wiki !== null && d.photo !== false).map((d) => d.code),
    );
    for (const code of Object.keys(images)) {
      expect(allowed.has(code), code).toBe(true);
    }
  });

  it("are hosted on Wikimedia and carry a credit and licence", () => {
    for (const [code, img] of Object.entries(images)) {
      for (const url of [img.url, img.thumbUrl]) {
        expect(new URL(url).protocol, code).toBe("https:");
        expect(new URL(url).hostname, code).toMatch(/^(upload|thumb)\.wikimedia\.org$/);
      }
      expect(img.sourceUrl, code).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(img.license.length, code).toBeGreaterThan(0);
      expect(img.author.length, code).toBeGreaterThan(0);
      expect(img.width > 0 && img.height > 0, code).toBe(true);
      expect(img.thumbWidth > 0 && img.thumbHeight > 0, code).toBe(true);
    }
  });
});
