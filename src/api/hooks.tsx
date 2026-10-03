import { FC, ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  api,
  fetchMovie,
  fetchMovieCount,
  fetchMoviesById,
  fetchMoviesList,
} from "./client";

type QueryOptions<T> = Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;

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
    queryFn: async () => fetchMoviesList(params),
    ...options,
  });

export const useGetRandomMovie = (
  params: MovieListQuery,
  roll: number,
  options?: QueryOptions<Movie>,
): UseQueryResult<Movie, Error> =>
  useQuery({
    queryKey: ["movies/random", params, roll],
    queryFn: async () => api<Movie>("/movies/random", params),
    ...options,
  });

export const useMovieGet = (
  params: MovieGetQuery,
  options?: QueryOptions<Movie>,
): UseQueryResult<Movie, Error> =>
  useQuery({
    queryKey: ["movies/get", params],
    queryFn: async () => fetchMovie(params),
    ...options,
  });

export const useMovieListById = (
  params: MovieListByIdQuery,
  options?: QueryOptions<Movie[]>,
): UseQueryResult<Movie[], Error> =>
  useQuery({
    queryKey: ["movies/list/id", params],
    queryFn: async () => fetchMoviesById(params),
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
    queryFn: async () => fetchMovieCount(),
    ...options,
  });
