export const METHODS = ["baking", "cooking", "no-cook"] as const;
export type Method = (typeof METHODS)[number];

export const COURSES = ["main", "dessert", "snack", "bread", "drink"] as const;
export type Course = (typeof COURSES)[number];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
] as const;
export type Region = (typeof REGIONS)[number];

/** "Up to" caps for the time filter, in minutes. */
export const TIME_CAPS = [30, 60, 120] as const;
export type TimeCap = (typeof TIME_CAPS)[number];

export const METHOD_LABELS: Record<Method, string> = {
  baking: "Baking",
  cooking: "Cooking",
  "no-cook": "No-cook",
};

export const METHOD_HINTS: Record<Method, string> = {
  baking: "The oven does the main work",
  cooking: "Stove, grill, fryer or steamer",
  "no-cook": "No stove or oven for the dish itself",
};

export const COURSE_LABELS: Record<Course, string> = {
  main: "Main",
  dessert: "Dessert",
  snack: "Snack or side",
  bread: "Bread",
  drink: "Drink",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const TIME_CAP_LABELS: Record<TimeCap, string> = {
  30: "30 min",
  60: "1 hour",
  120: "2 hours",
};

/** The hand-written part of an entry: one dish for one country. */
export interface DishEntry {
  /** ISO 3166-1 alpha-2 code of the country. */
  code: string;
  dish: string;
  /** Name in the local language, when it differs from `dish`. */
  localName?: string;
  description: string;
  /** One line on why this dish stands for this country. */
  whyUnique: string;
  method: Method;
  course: Course;
  difficulty: Difficulty;
  /** Start to finish, including soaking, marinating, proofing and chilling. */
  minutes: number;
  /**
   * English Wikipedia article title. Usually the dish's own article; a few
   * dishes without one point at a broader article instead. `null` if neither exists.
   */
  wiki: string | null;
  /** Set to false when the article's lead image doesn't show this dish. */
  photo?: false;
}

/** Generated from the `world-countries` package by scripts/build-geo.ts. */
export interface Geo {
  code: string;
  name: string;
  /** ISO 3166-1 numeric code, used to find the country's shape on the globe. */
  numeric: string | null;
  region: Region;
  lat: number;
  lng: number;
}

export interface Country extends Geo, Omit<DishEntry, "code"> {
  flag: string;
}

export const EXCLUSION_KINDS = ["shared", "unverified", "none"] as const;
export type ExclusionKind = (typeof EXCLUSION_KINDS)[number];

export const EXCLUSION_KIND_LABELS: Record<ExclusionKind, string> = {
  shared: "Signature dishes are shared with neighbours",
  unverified: "Couldn't confirm a distinctive dish",
  none: "No cuisine of its own",
};

export interface ExcludedEntry {
  code: string;
  kind: ExclusionKind;
  reason: string;
}

export interface DishImage {
  /** 960px-wide thumbnail on upload.wikimedia.org. */
  url: string;
  width: number;
  height: number;
  /** 330px-wide thumbnail for grids. */
  thumbUrl: string;
  thumbWidth: number;
  thumbHeight: number;
  /** Plain-text author credit. */
  author: string;
  license: string;
  licenseUrl: string | null;
  /** The file's page on Wikimedia Commons. */
  sourceUrl: string;
}
