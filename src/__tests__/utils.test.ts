import { describe, expect, it } from "vitest";
import {
  gridLink,
  jsonLdScript,
  movieSearch,
  parseGridQuery,
  sitemapPaths,
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

  it("parses free=true as a boolean and ignores other values", () => {
    expect(parseGridQuery({ free: "true" })).toEqual({ free: true });
    expect(parseGridQuery({ free: "false" })).toEqual({});
    expect(parseGridQuery({ free: "1" })).toEqual({});
  });

  it("parses dani_approved=true as a boolean and ignores other values", () => {
    expect(parseGridQuery({ dani_approved: "true" })).toEqual({
      dani_approved: true,
    });
    expect(parseGridQuery({ dani_approved: "false" })).toEqual({});
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

describe("sitemapPaths", () => {
  it("lists static pages, movies, and people with enough appearances", () => {
    const movies = [
      makeMovie({ tmdbid: 1, cast: ["Regular", "One Timer"] }),
      makeMovie({ tmdbid: 2, cast: ["Regular"], directors: ["Two Timer"] }),
      makeMovie({ tmdbid: 3, cast: ["Regular", "Two Timer"] }),
    ];
    const paths = sitemapPaths(movies);
    expect(paths).toContain("");
    expect(paths).toContain("/stats");
    expect(paths).toContain("/movie/1");
    expect(paths).toContain("/movie/3");
    expect(paths).toContain("/person/Regular");
    expect(paths).not.toContain("/person/One%20Timer");
    expect(paths).not.toContain("/person/Two%20Timer");
  });

  it("counts a person once per movie even when both acting and directing", () => {
    const paths = sitemapPaths([
      makeMovie({ tmdbid: 1, cast: ["Both"], directors: ["Both"] }),
    ]);
    expect(paths).not.toContain("/person/Both");
  });
});

describe("jsonLdScript", () => {
  it("escapes < so content cannot close the script tag", () => {
    expect(jsonLdScript({ name: "</script><b>" })).toBe(
      '{"name":"\\u003c/script>\\u003cb>"}',
    );
  });
});

describe("movieSearch", () => {
  const movies = [
    makeMovie({ movie: "The Batman", cast: ["Zoë Kravitz"], tmdbid: 1 }),
    makeMovie({
      movie: "Amélie",
      directors: ["Jean-Pierre Jeunet"],
      tmdbid: 2,
    }),
  ];

  it("matches accented text from unaccented input and vice versa", () => {
    expect(movieSearch("zoe kravitz", movies).map((m) => m.tmdbid)).toEqual([
      1,
    ]);
    expect(movieSearch("amelie", movies).map((m) => m.tmdbid)).toEqual([2]);
    expect(movieSearch("Amélie", movies).map((m) => m.tmdbid)).toEqual([2]);
  });

  it("searches titles, cast and directors case-insensitively", () => {
    expect(movieSearch("batman", movies)).toHaveLength(1);
    expect(movieSearch("jeunet", movies)).toHaveLength(1);
    expect(movieSearch("nolan", movies)).toHaveLength(0);
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
