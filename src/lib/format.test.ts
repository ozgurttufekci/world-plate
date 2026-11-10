import { describe, expect, it } from "vitest";
import { countryPath, flagOf, formatMinutes, recipeSearchUrl, wikiUrl } from "./format";

describe("format helpers", () => {
  it("builds flag emoji from country codes", () => {
    expect(flagOf("TR")).toBe("\u{1F1F9}\u{1F1F7}");
    expect(flagOf("xk")).toBe("\u{1F1FD}\u{1F1F0}");
  });

  it("builds lower-case country paths", () => {
    expect(countryPath("TR")).toBe("/country/tr");
  });

  it("builds Wikipedia links from article titles", () => {
    expect(wikiUrl("Menemen (food)")).toBe("https://en.wikipedia.org/wiki/Menemen_(food)");
    expect(wikiUrl("Fårikål")).toBe("https://en.wikipedia.org/wiki/F%C3%A5rik%C3%A5l");
  });

  it("builds a recipe search link", () => {
    expect(recipeSearchUrl("Pão de queijo", "Brazil")).toBe(
      "https://www.google.com/search?q=P%C3%A3o%20de%20queijo%20recipe%20Brazil",
    );
  });

  it("formats durations", () => {
    expect(formatMinutes(25)).toBe("25 min");
    expect(formatMinutes(60)).toBe("1 h");
    expect(formatMinutes(75)).toBe("1 h 15 min");
    expect(formatMinutes(720)).toBe("12 h");
    expect(formatMinutes(1500)).toBe("about a day");
    expect(formatMinutes(4500)).toBe("about 3 days");
  });
});
