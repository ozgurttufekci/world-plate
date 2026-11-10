import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
  activeFilterCount,
  matchesFilters,
  parseFilters,
  serializeFilters,
  toggleValue,
  withFilters,
  type Filterable,
  type Filters,
} from "./filters";

const bread: Filterable = {
  method: "baking",
  course: "bread",
  difficulty: "easy",
  region: "Europe",
  minutes: 50,
};

const parse = (qs: string) => parseFilters(new URLSearchParams(qs));

describe("parseFilters", () => {
  it("returns empty filters for an empty query", () => {
    expect(parse("")).toEqual(EMPTY_FILTERS);
  });

  it("reads every filter group", () => {
    expect(
      parse("method=baking,no-cook&course=dessert&difficulty=easy&region=north-america,asia&time=60"),
    ).toEqual({
      methods: ["baking", "no-cook"],
      courses: ["dessert"],
      difficulties: ["easy"],
      regions: ["Asia", "North America"],
      maxMinutes: 60,
    });
  });

  it("ignores unknown values and unknown time caps", () => {
    expect(parse("method=frying,baking&region=atlantis&time=45&course=")).toEqual({
      ...EMPTY_FILTERS,
      methods: ["baking"],
    });
  });
});

describe("serializeFilters", () => {
  it("is empty when nothing is set", () => {
    expect(serializeFilters(EMPTY_FILTERS)).toBe("");
    expect(withFilters("/browse", EMPTY_FILTERS)).toBe("/browse");
  });

  it("round-trips through parseFilters", () => {
    const filters: Filters = {
      methods: ["baking", "cooking"],
      courses: ["bread", "drink"],
      difficulties: ["hard"],
      regions: ["South America", "Oceania"],
      maxMinutes: 120,
    };
    const qs = serializeFilters(filters);
    expect(qs).toBe(
      "method=baking,cooking&course=bread,drink&difficulty=hard&region=south-america,oceania&time=120",
    );
    expect(parse(qs)).toEqual(filters);
    expect(withFilters("/country/tr", filters)).toBe(`/country/tr?${qs}`);
  });
});

describe("matchesFilters", () => {
  it("matches everything when no filter is set", () => {
    expect(matchesFilters(bread, EMPTY_FILTERS)).toBe(true);
  });

  it("treats values inside a group as alternatives", () => {
    expect(matchesFilters(bread, { ...EMPTY_FILTERS, methods: ["cooking", "baking"] })).toBe(true);
    expect(matchesFilters(bread, { ...EMPTY_FILTERS, methods: ["cooking"] })).toBe(false);
  });

  it("requires every group to match", () => {
    const filters: Filters = { ...EMPTY_FILTERS, methods: ["baking"], courses: ["dessert"] };
    expect(matchesFilters(bread, filters)).toBe(false);
    expect(matchesFilters({ ...bread, course: "dessert" }, filters)).toBe(true);
  });

  it("treats the time cap as inclusive", () => {
    expect(matchesFilters({ ...bread, minutes: 60 }, { ...EMPTY_FILTERS, maxMinutes: 60 })).toBe(true);
    expect(matchesFilters({ ...bread, minutes: 61 }, { ...EMPTY_FILTERS, maxMinutes: 60 })).toBe(false);
  });

  it("filters by region", () => {
    expect(matchesFilters(bread, { ...EMPTY_FILTERS, regions: ["Asia"] })).toBe(false);
    expect(matchesFilters(bread, { ...EMPTY_FILTERS, regions: ["Asia", "Europe"] })).toBe(true);
  });
});

describe("helpers", () => {
  it("counts active filters", () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0);
    expect(
      activeFilterCount({ ...EMPTY_FILTERS, methods: ["baking", "cooking"], maxMinutes: 30 }),
    ).toBe(3);
  });

  it("toggles a value in a list", () => {
    expect(toggleValue(["a"], "b")).toEqual(["a", "b"]);
    expect(toggleValue(["a", "b"], "a")).toEqual(["b"]);
  });
});
