/**
 * Prints how the included countries spread across each filter value, and how
 * many countries the common two-filter combinations leave. Run with `pnpm data:report`.
 */
import { countries, excludedCountries, geo } from "../src/data/countries";
import { images } from "../src/data/images";
import {
  COURSES,
  DIFFICULTIES,
  EXCLUSION_KINDS,
  METHODS,
  REGIONS,
  TIME_CAPS,
  type Country,
} from "../src/data/schema";

function table(title: string, rows: [string, number][]) {
  console.log(`\n${title}`);
  for (const [label, n] of rows) {
    console.log(`  ${label.padEnd(16)} ${String(n).padStart(4)}  ${"#".repeat(Math.round(n / 2))}`);
  }
}

const count = (pred: (c: Country) => boolean) => countries.filter(pred).length;

console.log(
  `Candidates ${geo.length}, included ${countries.length}, excluded ${excludedCountries.length}, with photo ${Object.keys(images).length}`,
);

table("Region (included / candidates)", REGIONS.map((r) => [r, count((c) => c.region === r)]));
for (const r of REGIONS) {
  const total = geo.filter((g) => g.region === r).length;
  console.log(`  ${r.padEnd(16)} ${count((c) => c.region === r)} of ${total}`);
}
table("Method", METHODS.map((m) => [m, count((c) => c.method === m)]));
table("Course", COURSES.map((v) => [v, count((c) => c.course === v)]));
table("Difficulty", DIFFICULTIES.map((v) => [v, count((c) => c.difficulty === v)]));
table("Time (up to)", [
  ...TIME_CAPS.map((cap): [string, number] => [`${cap} min`, count((c) => c.minutes <= cap)]),
  ["any", countries.length],
]);
table(
  "Excluded by kind",
  EXCLUSION_KINDS.map((k) => [k, excludedCountries.filter((e) => e.kind === k).length]),
);

console.log("\nMethod x course");
console.log(`  ${"".padEnd(10)}${COURSES.map((c) => c.padStart(9)).join("")}`);
for (const m of METHODS) {
  const cells = COURSES.map((v) => String(count((c) => c.method === m && c.course === v)).padStart(9));
  console.log(`  ${m.padEnd(10)}${cells.join("")}`);
}

console.log("\nMethod x region");
console.log(`  ${"".padEnd(10)}${REGIONS.map((r) => r.slice(0, 8).padStart(9)).join("")}`);
for (const m of METHODS) {
  const cells = REGIONS.map((r) => String(count((c) => c.method === m && c.region === r)).padStart(9));
  console.log(`  ${m.padEnd(10)}${cells.join("")}`);
}

console.log("\nThin single values (fewer than 5 countries):");
const thin = [
  ...METHODS.map((m): [string, number] => [`method ${m}`, count((c) => c.method === m)]),
  ...COURSES.map((v): [string, number] => [`course ${v}`, count((c) => c.course === v)]),
].filter(([, n]) => n < 5);
console.log(thin.map(([l, n]) => `  ${l}: ${n}`).join("\n") || "  none");
