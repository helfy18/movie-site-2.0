import type { ParsedUrlQuery } from "querystring";

export const generateEmptyMovie = (movie: TMDBMovie): Movie => {
  return {
    movie: movie.title,
    jh_score: -1,
    genre: "",
    year: 0,
    ranking: "",
    plot: "",
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "",
    actors: "",
    director: "",
    ratings: [],
    boxoffice: "",
    rated: "",
    runtime: 0,
    provider: { link: "", rent: [], flatrate: [], buy: [] },
    budget: "",
    tmdbid: movie.id,
    recommendations: [],
    rottentomatoes: "",
    imdb: "",
    metacritic: "",
    trailer: "",
    dani_approved: false,
  };
};

const stringListKeys = [
  "genre",
  "universe",
  "exclusive",
  "studio",
  "holiday",
  "year",
  "director",
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
  return result;
};

export const gridLink = (query: MovieListQuery) => ({
  pathname: "/movie-grid",
  query: { ...query },
});
