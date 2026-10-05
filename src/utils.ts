import type { ParsedUrlQuery } from "querystring";

export const toPosterMovie = ({
  movie,
  jh_score,
  poster,
  tmdbid,
  dani_approved,
}: PosterMovie): PosterMovie => ({
  movie,
  jh_score,
  poster,
  tmdbid,
  dani_approved,
});

// An unrated theatre listing: jh_score -1 renders as "N/A" and doesn't link.
export const unratedPosterMovie = (movie: TMDBMovie): PosterMovie => ({
  movie: movie.title,
  jh_score: -1,
  poster: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "",
  tmdbid: movie.id,
  dani_approved: false,
});

const stringListKeys = [
  "genre",
  "universe",
  "exclusive",
  "studio",
  "holiday",
  "year",
  "director",
  "actor",
  "decade",
  "provider",
] as const;
const numberListKeys = ["runtime", "rating"] as const;

const toList = (value: string | string[] | undefined) =>
  value === undefined ? undefined : Array.isArray(value) ? value : [value];

export const parseGridQuery = (query: ParsedUrlQuery): MovieListQuery => {
  const result: MovieListQuery = {};
  for (const key of stringListKeys) {
    const list = toList(query[key]);
    if (list) result[key] = list;
  }
  for (const key of numberListKeys) {
    const list = toList(query[key]);
    if (list) result[key] = list.map(Number);
  }
  if (query.free === "true") result.free = true;
  if (query.dani_approved === "true") result.dani_approved = true;
  return result;
};

export const gridLink = (query: MovieListQuery) => ({
  pathname: "/movie-grid",
  query: { ...query },
});

export const personLink = (name: string) =>
  `/person/${encodeURIComponent(name)}`;

const stripAccents = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const movieSearch = (text: string, movies: CompactMovie[]) => {
  const needle = stripAccents(text);
  const keys: (keyof CompactMovie)[] = [
    "movie",
    "cast",
    "directors",
    "universe",
    "sub_universe",
    "studio",
  ];

  return movies.filter((movie) =>
    keys.some((key) => {
      const value = movie[key];
      return value != null && stripAccents(value.toString()).includes(needle);
    }),
  );
};
