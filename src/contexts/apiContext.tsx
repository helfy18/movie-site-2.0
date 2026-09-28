import { FC, ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIURL || "http://localhost:8080",
  paramsSerializer: { indexes: null },
});

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: process.env.NEXT_PUBLIC_TMDBKEY, region: "US" },
});

type QueryOptions<T> = Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;

export const ApiProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 0, refetchOnWindowFocus: false },
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
      (await api.get<Movie[]>("/movies/list", { params })).data,
    ...options,
  });

export const useGetRandomMovie = (
  params: MovieListQuery,
  options?: QueryOptions<Movie>,
): UseQueryResult<Movie, Error> =>
  useQuery({
    queryKey: ["movies/random", params],
    queryFn: async () =>
      (await api.get<Movie>("/movies/random", { params })).data,
    ...options,
  });

export const useMovieGet = (
  params: MovieGetQuery,
  options?: QueryOptions<Movie>,
): UseQueryResult<Movie, Error> =>
  useQuery({
    queryKey: ["movies/get", params],
    queryFn: async () => (await api.get<Movie>("/movies/get", { params })).data,
    ...options,
  });

export const useMovieListById = (
  params: MovieListByIdQuery,
  options?: QueryOptions<Movie[]>,
): UseQueryResult<Movie[], Error> =>
  useQuery({
    queryKey: ["movies/list/id", params],
    queryFn: async () =>
      (await api.get<Movie[]>("/movies/list/id", { params })).data,
    ...options,
  });

export const useTypesList = (
  options?: QueryOptions<AllType>,
): UseQueryResult<AllType, Error> =>
  useQuery({
    queryKey: ["types/list"],
    queryFn: async () => (await api.get<AllType>("/types/list")).data,
    ...options,
  });

export const useMovieCount = (
  options?: QueryOptions<number>,
): UseQueryResult<number, Error> =>
  useQuery({
    queryKey: ["movies/count"],
    queryFn: async () => (await api.get<number>("/movies/count")).data,
    ...options,
  });

export const useGetRecentMovies = (
  params?: MostRecentMovieQuery,
  options?: QueryOptions<Movie[]>,
): UseQueryResult<Movie[], Error> =>
  useQuery({
    queryKey: ["movies/mostRecent", params],
    queryFn: async () =>
      (await api.get<Movie[]>("/movies/mostRecent", { params })).data,
    ...options,
  });

export const useGetNowPlaying = (
  options?: QueryOptions<TMDBMovie[]>,
): UseQueryResult<TMDBMovie[], Error> =>
  useQuery({
    queryKey: ["tmdb/now_playing"],
    queryFn: async () =>
      (await tmdb.get<{ results: TMDBMovie[] }>("/movie/now_playing")).data
        .results,
    ...options,
  });

export const useGetUpcoming = (
  options?: QueryOptions<TMDBMovie[]>,
): UseQueryResult<TMDBMovie[], Error> =>
  useQuery({
    queryKey: ["tmdb/upcoming"],
    queryFn: async () =>
      (await tmdb.get<{ results: TMDBMovie[] }>("/movie/upcoming")).data
        .results,
    ...options,
  });
