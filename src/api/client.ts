const BASEURL = process.env.NEXT_PUBLIC_APIURL || "http://localhost:8080";

class HttpError extends Error {
  status: number;
  constructor(status: number, statusText: string) {
    super(`${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
  }
}

export const buildUrl = (base: string, path: string, params?: object) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      search.append(key, String(item));
    }
  }
  const query = search.toString();
  return query ? `${base}${path}?${query}` : `${base}${path}`;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// During `next build` thousands of requests hit the API in a burst; retry
// transient failures (5xx, network) so one hiccup doesn't fail the build.
// In the browser a single attempt is fine; react-query handles retries.
const BUILD_RETRIES = typeof window === "undefined" ? 3 : 0;

export const getJson = async <T>(url: string): Promise<T> => {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
      if (res.status < 500 || attempt >= BUILD_RETRIES)
        throw new HttpError(res.status, res.statusText);
    } catch (error) {
      if (error instanceof HttpError || attempt >= BUILD_RETRIES) throw error;
    }
    await sleep(1000 * 2 ** attempt);
  }
};

export const api = <T>(path: string, params?: object) =>
  getJson<T>(buildUrl(BASEURL, path, params));

export const hasServerResponse = (error: unknown): boolean =>
  error instanceof HttpError;

export const isNotFound = (error: unknown): boolean =>
  error instanceof HttpError && error.status === 404;

export const fetchMovie = (params: MovieGetQuery) =>
  api<Movie>("/movies/get", params);
export const fetchMoviesById = (params: MovieListByIdQuery) =>
  api<Movie[]>("/movies/list/id", params);
export const fetchMovieCount = () => api<number>("/movies/count");
export const fetchMoviesList = (params: MovieListQuery) =>
  api<Movie[]>("/movies/list", params);
export const fetchMoviesListCompact = (params: MovieListQuery) =>
  api<CompactMovie[]>("/movies/list", { ...params, view: "compact" });
export const fetchRecentMovies = (params?: MostRecentMovieQuery) =>
  api<CompactMovie[]>("/movies/mostRecent", { ...params, view: "compact" });

// The unfiltered compact list is written to the export by scripts/generate-static.mjs
// and served from the CDN. Falls back to the API when the file is missing (next dev).
export const fetchCatalogue = () =>
  getJson<CompactMovie[]>("/data/movies.json").catch(() =>
    fetchMoviesListCompact({}),
  );
