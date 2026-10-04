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

export const getJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new HttpError(res.status, res.statusText);
  return res.json();
};

export const api = <T>(path: string, params?: object) =>
  getJson<T>(buildUrl(BASEURL, path, params));

export const hasServerResponse = (error: unknown): boolean =>
  error instanceof HttpError;

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
