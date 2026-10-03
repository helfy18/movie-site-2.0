import { describe, expect, it } from "vitest";
import { buildRows, isChristmas, isHalloween, withRatings } from "@/homeRows";
import { makeMovie, makeTmdbMovie } from "./testData";

describe("isChristmas", () => {
  it("starts November 1st", () => {
    expect(isChristmas(new Date(2026, 9, 31))).toBe(false);
    expect(isChristmas(new Date(2026, 10, 1))).toBe(true);
  });

  it("runs through December 31st", () => {
    expect(isChristmas(new Date(2026, 11, 31))).toBe(true);
    expect(isChristmas(new Date(2027, 0, 1))).toBe(false);
  });
});

describe("isHalloween", () => {
  it("covers October only", () => {
    expect(isHalloween(new Date(2026, 8, 30))).toBe(false);
    expect(isHalloween(new Date(2026, 9, 1))).toBe(true);
    expect(isHalloween(new Date(2026, 9, 31))).toBe(true);
    expect(isHalloween(new Date(2026, 10, 1))).toBe(false);
  });
});

describe("withRatings", () => {
  it("uses the rated movie when one matches the TMDB id", () => {
    const rated = makeMovie({ tmdbid: 7, movie: "Rated", jh_score: 88 });
    const result = withRatings(
      [makeTmdbMovie({ id: 7 })],
      new Map([[7, rated]]),
    );
    expect(result).toEqual([
      {
        movie: "Rated",
        jh_score: 88,
        poster: rated.poster,
        tmdbid: 7,
        dani_approved: false,
      },
    ]);
  });

  it("builds an unrated poster for unmatched movies", () => {
    const result = withRatings([makeTmdbMovie({ id: 8 })], new Map());
    expect(result).toHaveLength(1);
    expect(result[0].jh_score).toBe(-1);
    expect(result[0].tmdbid).toBe(8);
  });

  it("drops unmatched movies without a poster", () => {
    const result = withRatings(
      [makeTmdbMovie({ id: 9, poster_path: null })],
      new Map(),
    );
    expect(result).toEqual([]);
  });
});

describe("buildRows", () => {
  const june = new Date(2026, 5, 15);
  const october = new Date(2026, 9, 15);
  const december = new Date(2026, 11, 25);

  const catalogue = [
    makeMovie({ tmdbid: 1, year: 2026 }),
    makeMovie({ tmdbid: 2, year: 2025 }),
    makeMovie({ tmdbid: 3, year: 1985 }),
    makeMovie({ tmdbid: 4, year: 1995 }),
    makeMovie({ tmdbid: 5, universe: "DC" }),
    makeMovie({ tmdbid: 6, universe: "Marvel" }),
    makeMovie({ tmdbid: 7, holiday: "Christmas" }),
    makeMovie({ tmdbid: 8, holiday: "Halloween", genre: "Horror" }),
  ];

  const titles = (today: Date) =>
    buildRows(catalogue, today).map((row) => row.title);

  it("always includes the year, decade and universe rows", () => {
    expect(titles(june)).toEqual([
      "Best of This Year",
      "Best of Last Year",
      "Best of the 80's",
      "Best of the 90's",
      "Best of DC",
      "Best of Marvel",
    ]);
  });

  it("adds Halloween rows in October only", () => {
    expect(titles(october)).toContain("Best Halloween Movies");
    expect(titles(october)).toContain("Spooky Season");
    expect(titles(june)).not.toContain("Best Halloween Movies");
    expect(titles(december)).not.toContain("Best Halloween Movies");
  });

  it("adds the Christmas row from November onward", () => {
    expect(titles(december)).toContain("Best Christmas Movies");
    expect(titles(october)).not.toContain("Best Christmas Movies");
  });

  it("bases the year rows on the latest catalogue year, not today", () => {
    const rows = buildRows(catalogue, june);
    const thisYear = rows.find((row) => row.title === "Best of This Year");
    const lastYear = rows.find((row) => row.title === "Best of Last Year");
    expect(thisYear?.link).toEqual({ year: ["2026"] });
    expect(thisYear?.movies.map((m) => m.tmdbid)).toEqual([1]);
    expect(lastYear?.link).toEqual({ year: ["2025"] });
    expect(lastYear?.movies.map((m) => m.tmdbid)).toEqual([2]);
  });

  it("caps each row at 20 movies", () => {
    const big = Array.from({ length: 30 }, (_, i) =>
      makeMovie({ tmdbid: i + 1, year: 2026 }),
    );
    const rows = buildRows(big, june);
    const thisYear = rows.find((row) => row.title === "Best of This Year");
    expect(thisYear?.movies).toHaveLength(20);
  });

  it("returns no rows for an empty catalogue", () => {
    expect(buildRows([], june)).toEqual([]);
    expect(buildRows([], december)).toEqual([]);
  });

  it("trims row movies to the poster shape", () => {
    const rows = buildRows(catalogue, june);
    for (const movie of rows.flatMap((row) => row.movies)) {
      expect(Object.keys(movie).sort()).toEqual([
        "dani_approved",
        "jh_score",
        "movie",
        "poster",
        "tmdbid",
      ]);
    }
  });
});
