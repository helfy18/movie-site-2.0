import { describe, expect, it } from "vitest";
import { buildStats, BUCKET_COUNT, GENRE_LIMIT } from "@/stats";
import { makeMovie } from "./testData";

describe("buildStats", () => {
  it("computes totals from the catalogue", () => {
    const stats = buildStats([
      makeMovie({ jh_score: 100, runtime: 1440 }),
      makeMovie({ jh_score: 50, runtime: 720 }),
    ]);
    expect(stats.movieCount).toBe(2);
    expect(stats.runtimeDays).toBe(1.5);
    expect(stats.avgScore).toBe(75);
    expect(stats.perfectScores).toBe(1);
  });

  it("buckets scores into 5-point ranges with 100 in the last bucket", () => {
    const stats = buildStats([
      makeMovie({ jh_score: 0 }),
      makeMovie({ jh_score: 4 }),
      makeMovie({ jh_score: 5 }),
      makeMovie({ jh_score: 97 }),
      makeMovie({ jh_score: 100 }),
    ]);
    expect(stats.distribution).toHaveLength(BUCKET_COUNT);
    expect(stats.distribution[0]).toBe(2);
    expect(stats.distribution[1]).toBe(1);
    expect(stats.distribution[BUCKET_COUNT - 1]).toBe(2);
    expect(stats.distribution.reduce((a, b) => a + b, 0)).toBe(5);
  });

  it("groups decades in order and counts both genres", () => {
    const stats = buildStats([
      makeMovie({ year: 1994, jh_score: 80, genre: "Drama" }),
      makeMovie({ year: 1999, jh_score: 60, genre: "Drama", genre_2: "Crime" }),
      makeMovie({ year: 2008, jh_score: 90, genre: "Comic Book" }),
    ]);
    expect(stats.decades).toEqual([
      { label: "1990s", count: 2, avg: 70, query: { decade: ["1990-1999"] } },
      { label: "2000s", count: 1, avg: 90, query: { decade: ["2000-2009"] } },
    ]);
    expect(stats.genres).toEqual([
      { label: "Drama", count: 2, avg: 70, query: { genre: ["Drama"] } },
      {
        label: "Comic Book",
        count: 1,
        avg: 90,
        query: { genre: ["Comic Book"] },
      },
      { label: "Crime", count: 1, avg: 60, query: { genre: ["Crime"] } },
    ]);
  });

  it("computes the median score", () => {
    const scores = [10, 40, 70, 100];
    const stats = buildStats(
      scores.map((jh_score, i) => makeMovie({ jh_score, tmdbid: i })),
    );
    expect(stats.medianScore).toBe(55);
  });

  it("caps genres and folds the rest into Other", () => {
    const movies = Array.from({ length: GENRE_LIMIT + 2 }, (_, i) =>
      makeMovie({
        genre: `Genre ${String(i).padStart(2, "0")}`,
        jh_score: 50 + i,
        tmdbid: i,
      }),
    );
    const stats = buildStats(movies);
    expect(stats.genres).toHaveLength(GENRE_LIMIT + 1);
    const other = stats.genres[GENRE_LIMIT];
    expect(other.label).toBe("Other");
    expect(other.count).toBe(2);
    expect(other.query).toBeUndefined();
  });

  it("applies minimum movie counts to leaderboards", () => {
    const prolific = Array.from({ length: 3 }, (_, i) =>
      makeMovie({ jh_score: 90, directors: ["Threepeat"], tmdbid: i }),
    );
    const oneHit = makeMovie({ jh_score: 100, directors: ["One Hit"] });
    const stats = buildStats([...prolific, oneHit]);
    expect(stats.directors.best).toEqual([
      { name: "Threepeat", count: 3, avg: 90 },
    ]);
  });

  it("only counts top-billed roles toward actor averages", () => {
    const filler = Array.from({ length: 10 }, (_, i) => `Filler ${i}`);
    const movies = [
      ...Array.from({ length: 5 }, (_, i) =>
        makeMovie({ jh_score: 90, cast: [...filler, "Cameo King"], tmdbid: i }),
      ),
      makeMovie({ jh_score: 90, cast: ["Cameo King"], tmdbid: 99 }),
    ];
    const stats = buildStats(movies);
    const names = (list: { name: string }[]) => list.map((p) => p.name);
    expect(names(stats.actors.best)).not.toContain("Cameo King");
    expect(names(stats.actors.worst)).not.toContain("Cameo King");
    expect(names(stats.actors.mostWatched)).toContain("Cameo King");
  });

  it("builds critic gaps from parseable scores only", () => {
    const stats = buildStats([
      makeMovie({ jh_score: 90, imdb: "5.0/10", tmdbid: 1, movie: "Loved" }),
      makeMovie({ jh_score: 20, imdb: "8.0/10", tmdbid: 2, movie: "Hated" }),
      makeMovie({ jh_score: 50, imdb: "N/A", tmdbid: 3 }),
    ]);
    const imdb = stats.critics.find((c) => c.site === "IMDb");
    expect(imdb?.higher[0]).toEqual({
      movie: "Loved",
      tmdbid: 1,
      mine: 90,
      theirs: 50,
    });
    expect(imdb?.lower[0]).toEqual({
      movie: "Hated",
      tmdbid: 2,
      mine: 20,
      theirs: 80,
    });
    expect(imdb?.higher).toHaveLength(2);
  });

  it("computes dani approval stats", () => {
    const stats = buildStats([
      makeMovie({ jh_score: 90, dani_approved: true, tmdbid: 1 }),
      makeMovie({ jh_score: 50, dani_approved: false, tmdbid: 2 }),
      makeMovie({ jh_score: 70, dani_approved: false, tmdbid: 3 }),
    ]);
    expect(stats.dani.count).toBe(1);
    expect(stats.dani.avgApproved).toBe(90);
    expect(stats.dani.avgRest).toBe(60);
    expect(stats.dani.topGenre).toBeNull();
  });

  it("picks the best movie per year, newest first", () => {
    const stats = buildStats([
      makeMovie({ year: 2020, jh_score: 80, movie: "Winner", tmdbid: 1 }),
      makeMovie({ year: 2020, jh_score: 60, movie: "Loser", tmdbid: 2 }),
      makeMovie({ year: 1999, jh_score: 95, movie: "Old", tmdbid: 3 }),
    ]);
    expect(
      stats.bestByYear.map(({ year, movie }) => [year, movie.movie]),
    ).toEqual([
      [2020, "Winner"],
      [1999, "Old"],
    ]);
  });

  it("builds sub-universe leaderboards with the minimum applied", () => {
    const movies = [
      ...Array.from({ length: 3 }, (_, i) =>
        makeMovie({
          universe: "Marvel",
          sub_universe: "Spider-Verse",
          jh_score: 90,
          tmdbid: i,
        }),
      ),
      makeMovie({ sub_universe: "One Off", jh_score: 100, tmdbid: 50 }),
    ];
    const stats = buildStats(movies);
    expect(stats.subUniverses.best).toEqual([
      {
        name: "Marvel - Spider-Verse",
        count: 3,
        avg: 90,
        filter: "Spider-Verse",
      },
    ]);
  });

  it("does not double the label when a sub-universe matches its universe", () => {
    const movies = Array.from({ length: 3 }, (_, i) =>
      makeMovie({
        universe: "Disney Animation",
        sub_universe: "Disney Animation",
        jh_score: 70,
        tmdbid: i,
      }),
    );
    const stats = buildStats(movies);
    expect(stats.subUniverses.best[0].name).toBe("Disney Animation");
  });

  it("includes universes without sub-universes under their own name", () => {
    const movies = Array.from({ length: 3 }, (_, i) =>
      makeMovie({ universe: "John Wick", jh_score: 80, tmdbid: i }),
    );
    const stats = buildStats(movies);
    expect(stats.subUniverses.best).toEqual([
      { name: "John Wick", count: 3, avg: 80, filter: "John Wick" },
    ]);
  });

  it("ranks best, worst and most watched independently", () => {
    const movies = [
      ...Array.from({ length: 5 }, (_, i) =>
        makeMovie({ jh_score: 95, cast: ["Great", "Busy"], tmdbid: i }),
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        makeMovie({ jh_score: 20, cast: ["Rough", "Busy"], tmdbid: 10 + i }),
      ),
    ];
    const stats = buildStats(movies);
    expect(stats.actors.best[0].name).toBe("Great");
    expect(stats.actors.worst[0].name).toBe("Rough");
    expect(stats.actors.mostWatched[0]).toEqual({
      name: "Busy",
      count: 10,
      avg: 57.5,
    });
  });
});
