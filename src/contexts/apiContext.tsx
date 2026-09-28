import { FC, ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

const BASEURL = process.env.NEXT_PUBLIC_APIURL || "http://localhost:8080";
const TMDBURL = "https://api.themoviedb.org/3";

class HttpError extends Error {
  status: number;
  constructor(status: number, statusText: string) {
    super(`${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
  }
}

const buildUrl = (base: string, path: string, params?: object) => {
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

const getJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new HttpError(res.status, res.statusText);
  return res.json();
};

const api = <T,>(path: string, params?: object) =>
  getJson<T>(buildUrl(BASEURL, path, params));

const tmdb = <T,>(path: string) =>
  getJson<T>(
    buildUrl(TMDBURL, path, {
      api_key: process.env.NEXT_PUBLIC_TMDBKEY,
      region: "US",
    }),
  );

type QueryOptions<T> = Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;

export const hasServerResponse = (error: unknown): boolean =>
  error instanceof HttpError;

export const ApiProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const useMoviesList = (
  params: MovieListQuery,
  options?: QueryOptions<Movie[]>,
): UseQueryResult<Movie[], Error> =>
  useQuery({
    queryKey: ["movies/list", params],
    queryFn: async () =>
      api<Movie[]>("/movies/list", params),
    ...options,
  });

export const useGetRandomMovie = (
  params: MovieListQuery,
  options?: QueryOptions<Movie>,
): UseQueryResult<Movie, Error> =>
  useQuery({
    queryKey: ["movies/random", params],
    queryFn: async () =>
      api<Movie>("/movies/random", params),
    ...options,
  });

export const useMovieGet = (
  params: MovieGetQuery,
  options?: QueryOptions<Movie>,
): UseQueryResult<Movie, Error> =>
  useQuery({
    queryKey: ["movies/get", params],
    queryFn: async () => api<Movie>("/movies/get", params),
    ...options,
  });

export const useMovieListById = (
  params: MovieListByIdQuery,
  options?: QueryOptions<Movie[]>,
): UseQueryResult<Movie[], Error> =>
  useQuery({
    queryKey: ["movies/list/id", params],
    queryFn: async () =>
      api<Movie[]>("/movies/list/id", params),
    ...options,
  });

export const useTypesList = (
  options?: QueryOptions<AllType>,
): UseQueryResult<AllType, Error> =>
  useQuery({
    queryKey: ["types/list"],
    queryFn: async () => api<AllType>("/types/list"),
    ...options,
  });

export const useMovieCount = (
  options?: QueryOptions<number>,
): UseQueryResult<number, Error> =>
  useQuery({
    queryKey: ["movies/count"],
    queryFn: async () => api<number>("/movies/count"),
    ...options,
  });

export const useGetRecentMovies = (
  params?: MostRecentMovieQuery,
  options?: QueryOptions<Movie[]>,
): UseQueryResult<Movie[], Error> =>
  useQuery({
    queryKey: ["movies/mostRecent", params],
    queryFn: async () =>
      api<Movie[]>("/movies/mostRecent", params),
    ...options,
  });

export const useGetNowPlaying = (
  options?: QueryOptions<TMDBMovie[]>,
): UseQueryResult<TMDBMovie[], Error> =>
  useQuery({
    queryKey: ["tmdb/now_playing"],
    queryFn: async () =>
      (await tmdb<{ results: TMDBMovie[] }>("/movie/now_playing")).results,
    ...options,
  });

export const useGetUpcoming = (
  options?: QueryOptions<TMDBMovie[]>,
): UseQueryResult<TMDBMovie[], Error> =>
  useQuery({
    queryKey: ["tmdb/upcoming"],
    queryFn: async () =>
      (await tmdb<{ results: TMDBMovie[] }>("/movie/upcoming")).results,
    ...options,
  });
