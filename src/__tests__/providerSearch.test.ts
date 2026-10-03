import { describe, expect, it } from "vitest";
import { providerSearchUrl } from "@/providerSearch";

const FALLBACK = "https://www.justwatch.com/title";

describe("providerSearchUrl", () => {
  it("builds a search url for a known provider", () => {
    expect(providerSearchUrl(8, "The Matrix", FALLBACK)).toBe(
      "https://www.netflix.com/search?q=The%20Matrix",
    );
  });

  it("encodes special characters in the title", () => {
    expect(providerSearchUrl(192, "Fast & Furious", FALLBACK)).toBe(
      "https://www.youtube.com/results?search_query=Fast%20%26%20Furious",
    );
  });

  it("ignores the title for providers without search urls", () => {
    expect(providerSearchUrl(337, "Frozen", FALLBACK)).toBe(
      "https://www.disneyplus.com/browse/search",
    );
  });

  it("returns the fallback for an unknown provider", () => {
    expect(providerSearchUrl(999999, "The Matrix", FALLBACK)).toBe(FALLBACK);
  });
});
