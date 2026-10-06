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

// People below this many appearances are left out of the sitemap as thin pages.
const MIN_SITEMAP_APPEARANCES = 3;

export const sitemapPaths = (movies: CompactMovie[]): string[] => {
  const appearances = new Map<string, number>();
  for (const movie of movies) {
    const names = new Set([...(movie.cast ?? []), ...(movie.directors ?? [])]);
    for (const name of names) {
      appearances.set(name, (appearances.get(name) ?? 0) + 1);
    }
  }
  return [
    "",
    "/movie-grid",
    "/random-movie",
    "/stats",
    "/about",
    ...movies.map((movie) => `/movie/${movie.tmdbid}`),
    ...[...appearances]
      .filter(([, count]) => count >= MIN_SITEMAP_APPEARANCES)
      .map(([name]) => personLink(name)),
  ];
};

// Escapes < so embedded text can't close the JSON-LD script tag.
export const jsonLdScript = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

const stripAccents = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export interface PersonMatch {
  name: string;
  count: number;
}

const PERSON_SEARCH_LIMIT = 6;

export const personSearch = (
  text: string,
  movies: CompactMovie[],
): PersonMatch[] => {
  const needle = stripAccents(text.trim());
  if (needle.length < 2) return [];
  const counts = new Map<string, number>();
  for (const movie of movies) {
    const names = new Set([...(movie.cast ?? []), ...(movie.directors ?? [])]);
    for (const name of names) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts]
    .filter(([name]) => stripAccents(name).includes(needle))
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, PERSON_SEARCH_LIMIT);
};

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
