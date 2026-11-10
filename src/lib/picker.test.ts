import { describe, expect, it } from "vitest";
import { cryptoRandomInt, pickCountry } from "./picker";

const first = () => 0;

describe("pickCountry", () => {
  it("returns nothing for an empty pool", () => {
    expect(pickCountry([], new Set(), null, first)).toEqual({ code: null, reset: false });
  });

  it("only picks from the pool", () => {
    const pool = ["AA", "BB", "CC"];
    for (let i = 0; i < 200; i++) {
      expect(pool).toContain(pickCountry(pool, new Set(), null).code);
    }
  });

  it("skips countries that were already seen", () => {
    const pool = ["AA", "BB", "CC"];
    const seen = new Set(["AA", "CC"]);
    for (let i = 0; i < 50; i++) {
      expect(pickCountry(pool, seen, null)).toEqual({ code: "BB", reset: false });
    }
  });

  it("never repeats the country on screen while another is available", () => {
    const pool = ["AA", "BB"];
    for (let i = 0; i < 50; i++) {
      expect(pickCountry(pool, new Set(), "AA").code).toBe("BB");
    }
  });

  it("starts the pool over once everything in it has been seen", () => {
    const pool = ["AA", "BB", "CC"];
    const result = pickCountry(pool, new Set(pool), "CC", first);
    expect(result).toEqual({ code: "AA", reset: true });
  });

  it("does not reset while an unseen country remains", () => {
    const result = pickCountry(["AA", "BB"], new Set(["AA"]), null, first);
    expect(result).toEqual({ code: "BB", reset: false });
  });

  it("returns the only country in a pool of one without calling it a reset", () => {
    expect(pickCountry(["AA"], new Set(["AA"]), "AA", first)).toEqual({ code: "AA", reset: false });
    expect(pickCountry(["AA"], new Set(), null, first)).toEqual({ code: "AA", reset: false });
  });

  it("ignores seen countries that are outside the pool", () => {
    const result = pickCountry(["AA", "BB"], new Set(["ZZ", "AA"]), null, first);
    expect(result).toEqual({ code: "BB", reset: false });
  });

  it("uses the random index it is given", () => {
    const pool = ["AA", "BB", "CC", "DD"];
    expect(pickCountry(pool, new Set(), null, () => 2).code).toBe("CC");
    expect(pickCountry(pool, new Set(["AA"]), null, () => 2).code).toBe("DD");
  });

  it("visits every country once before repeating", () => {
    const pool = ["AA", "BB", "CC", "DD", "EE"];
    const seen = new Set<string>();
    let current: string | null = null;
    for (let i = 0; i < pool.length; i++) {
      const { code, reset } = pickCountry(pool, seen, current);
      expect(reset).toBe(false);
      expect(seen.has(code!)).toBe(false);
      seen.add(code!);
      current = code;
    }
    expect([...seen].sort()).toEqual(pool);
    expect(pickCountry(pool, seen, current).reset).toBe(true);
  });
});

describe("cryptoRandomInt", () => {
  it("stays in range and reaches every value", () => {
    const hits = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const v = cryptoRandomInt(5);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(5);
      hits.add(v);
    }
    expect(hits.size).toBe(5);
  });

  it("rejects a non-positive range", () => {
    expect(() => cryptoRandomInt(0)).toThrow(RangeError);
  });
});
