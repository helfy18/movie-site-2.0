import { describe, expect, it } from "vitest";
import {
  gridLink,
  parseGridQuery,
  toPosterMovie,
  unratedPosterMovie,
} from "@/utils";
import { makeMovie, makeTmdbMovie } from "./testData";

describe("parseGridQuery", () => {
  it("returns an empty query for an empty object", () => {
    expect(parseGridQuery({})).toEqual({});
  });

  it("wraps single string values in arrays", () => {
    expect(parseGridQuery({ genre: "Horror" })).toEqual({ genre: ["Horror"] });
  });

  it("keeps repeated values as arrays", () => {
    expect(parseGridQuery({ genre: ["Horror", "Comedy"] })).toEqual({
      genre: ["Horror", "Comedy"],
    });
  });

  it("converts runtime and rating values to numbers", () => {
    expect(parseGridQuery({ runtime: ["60", "180"], rating: "50" })).toEqual({
      runtime: [60, 180],
      rating: [50],
    });
  });

  it("ignores keys that are not filters", () => {
    expect(parseGridQuery({ page: "3", utm_source: "x" })).toEqual({});
  });

  it("parses a combined query", () => {
    expect(
      parseGridQuery({
        universe: "Marvel",
        decade: ["1990-1999"],
        year: "1995",
      }),
    ).toEqual({
      universe: ["Marvel"],
      decade: ["1990-1999"],
      year: ["1995"],
    });
  });
});

describe("toPosterMovie", () => {
  it("keeps only the fields a poster tile renders", () => {
    const movie = makeMovie({
      movie: "Heat",
      jh_score: 92,
      poster: "https://image.tmdb.org/t/p/w500/heat.jpg",
      tmdbid: 949,
      dani_approved: true,
    });
    expect(toPosterMovie(movie)).toEqual({
      movie: "Heat",
      jh_score: 92,
      poster: "https://image.tmdb.org/t/p/w500/heat.jpg",
      tmdbid: 949,
      dani_approved: true,
    });
  });
});

describe("unratedPosterMovie", () => {
  it("builds an unrated poster from a TMDB movie", () => {
    const poster = unratedPosterMovie(
      makeTmdbMovie({ id: 42, title: "New Release", poster_path: "/new.jpg" }),
    );
    expect(poster).toEqual({
      movie: "New Release",
      jh_score: -1,
      poster: "https://image.tmdb.org/t/p/w500/new.jpg",
      tmdbid: 42,
      dani_approved: false,
    });
  });

  it("falls back to an empty poster url without a poster path", () => {
    expect(
      unratedPosterMovie(makeTmdbMovie({ poster_path: null })).poster,
    ).toBe("");
  });
});

describe("gridLink", () => {
  it("links to the movie grid with the query attached", () => {
    expect(gridLink({ genre: ["Horror"] })).toEqual({
      pathname: "/movie-grid",
      query: { genre: ["Horror"] },
    });
  });
});
