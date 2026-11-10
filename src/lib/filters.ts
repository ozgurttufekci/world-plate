import {
  COURSES,
  DIFFICULTIES,
  METHODS,
  REGIONS,
  TIME_CAPS,
  type Course,
  type Difficulty,
  type Method,
  type Region,
  type TimeCap,
} from "@/data/schema";

export interface Filters {
  methods: Method[];
  courses: Course[];
  difficulties: Difficulty[];
  regions: Region[];
  /** "Up to" cap on total time, or null for any. */
  maxMinutes: TimeCap | null;
}

/** The fields of a country that filters look at. */
export interface Filterable {
  method: Method;
  course: Course;
  difficulty: Difficulty;
  region: Region;
  minutes: number;
}

export const EMPTY_FILTERS: Filters = {
  methods: [],
  courses: [],
  difficulties: [],
  regions: [],
  maxMinutes: null,
};

const PARAM = {
  methods: "method",
  courses: "course",
  difficulties: "difficulty",
  regions: "region",
  maxMinutes: "time",
} as const;

export function regionSlug(region: Region): string {
  return region.toLowerCase().replace(/ /g, "-");
}

type ParamSource = { get(name: string): string | null };

function parseList<T extends string>(
  raw: string | null,
  allowed: readonly T[],
): T[] {
  if (!raw) return [];
  const wanted = new Set(raw.split(","));
  // Keeping the canonical order makes equal filters serialize identically.
  return allowed.filter((v) => wanted.has(v));
}

/** Reads filters from a query string, ignoring anything it doesn't recognise. */
export function parseFilters(params: ParamSource): Filters {
  const regionSlugs = new Set((params.get(PARAM.regions) ?? "").split(","));
  const time = Number(params.get(PARAM.maxMinutes));
  return {
    methods: parseList(params.get(PARAM.methods), METHODS),
    courses: parseList(params.get(PARAM.courses), COURSES),
    difficulties: parseList(params.get(PARAM.difficulties), DIFFICULTIES),
    regions: REGIONS.filter((r) => regionSlugs.has(regionSlug(r))),
    maxMinutes: TIME_CAPS.find((cap) => cap === time) ?? null,
  };
}

/** Query string for the filters, without a leading "?". Empty when nothing is set. */
export function serializeFilters(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.methods.length) params.set(PARAM.methods, filters.methods.join(","));
  if (filters.courses.length) params.set(PARAM.courses, filters.courses.join(","));
  if (filters.difficulties.length)
    params.set(PARAM.difficulties, filters.difficulties.join(","));
  if (filters.regions.length)
    params.set(PARAM.regions, filters.regions.map(regionSlug).join(","));
  if (filters.maxMinutes !== null)
    params.set(PARAM.maxMinutes, String(filters.maxMinutes));
  // Commas are safe in a query string and read better unescaped.
  return params.toString().replace(/%2C/g, ",");
}

/** A path with the filters appended as a query string. */
export function withFilters(path: string, filters: Filters): string {
  const qs = serializeFilters(filters);
  return qs ? `${path}?${qs}` : path;
}

/** An empty group means "any"; within a group, values are alternatives. */
export function matchesFilters(item: Filterable, filters: Filters): boolean {
  return (
    (filters.methods.length === 0 || filters.methods.includes(item.method)) &&
    (filters.courses.length === 0 || filters.courses.includes(item.course)) &&
    (filters.difficulties.length === 0 ||
      filters.difficulties.includes(item.difficulty)) &&
    (filters.regions.length === 0 || filters.regions.includes(item.region)) &&
    (filters.maxMinutes === null || item.minutes <= filters.maxMinutes)
  );
}

export function activeFilterCount(filters: Filters): number {
  return (
    filters.methods.length +
    filters.courses.length +
    filters.difficulties.length +
    filters.regions.length +
    (filters.maxMinutes === null ? 0 : 1)
  );
}

export function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
