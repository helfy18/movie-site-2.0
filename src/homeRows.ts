import { toPosterMovie, unratedPosterMovie } from "@/utils";

export interface Row {
  title: string;
  movies: PosterMovie[];
  link: MovieListQuery;
}

export const isChristmas = (today: Date): boolean => {
  const year = today.getFullYear();
  return today >= new Date(year, 10, 1) && today < new Date(year + 1, 0, 1);
};

export const isHalloween = (today: Date): boolean => {
  const year = today.getFullYear();
  return today >= new Date(year, 9, 1) && today < new Date(year, 10, 1);
};

export const withRatings = (
  tmdbMovies: TMDBMovie[],
  ratedById: Map<number, Movie>,
): PosterMovie[] =>
  tmdbMovies.flatMap((movie) => {
    const rated = ratedById.get(movie.id);
    if (rated) return [toPosterMovie(rated)];
    return movie.poster_path ? [unratedPosterMovie(movie)] : [];
  });

export const buildRows = (catalogue: Movie[], today: Date): Row[] => {
  if (catalogue.length === 0) return [];
  const top = (test: (movie: Movie) => boolean) =>
    catalogue.filter(test).slice(0, 20).map(toPosterMovie);
  const latestYear = Math.max(...catalogue.map((movie) => movie.year));
  const lastYear = latestYear - 1;

  const rows: Row[] = [];
  if (isChristmas(today)) {
    rows.push({
      title: "Best Christmas Movies",
      movies: top((m) => m.holiday === "Christmas"),
      link: { holiday: ["Christmas"] },
    });
  }
  if (isHalloween(today)) {
    rows.push({
      title: "Best Halloween Movies",
      movies: top((m) => m.holiday === "Halloween"),
      link: { holiday: ["Halloween"] },
    });
    rows.push({
      title: "Spooky Season",
      movies: top((m) => m.genre === "Horror"),
      link: { genre: ["Horror"] },
    });
  }
  const freeMovies = top(
    (m) => !!(m.provider.free?.length || m.provider.ads?.length),
  );
  if (freeMovies.length > 0) {
    rows.push({
      title: "Free to Watch",
      movies: freeMovies,
      link: { free: true },
    });
  }
  rows.push(
    {
      title: "Best of This Year",
      movies: top((m) => m.year === latestYear),
      link: { year: [String(latestYear)] },
    },
    {
      title: "Best of Last Year",
      movies: top((m) => m.year === lastYear),
      link: { year: [String(lastYear)] },
    },
    {
      title: "Best of the 80's",
      movies: top((m) => m.year >= 1980 && m.year <= 1989),
      link: { decade: ["1980-1989"] },
    },
    {
      title: "Best of the 90's",
      movies: top((m) => m.year >= 1990 && m.year <= 1999),
      link: { decade: ["1990-1999"] },
    },
    {
      title: "Best of DC",
      movies: top((m) => m.universe === "DC"),
      link: { universe: ["DC"] },
    },
    {
      title: "Best of Marvel",
      movies: top((m) => m.universe === "Marvel"),
      link: { universe: ["Marvel"] },
    },
  );
  return rows;
};
