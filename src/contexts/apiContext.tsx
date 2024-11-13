import React, { createContext, useContext } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";

const BASEURL = process.env.NEXT_PUBLIC_APIURL || "http://localhost:8080";
const TMDBURL = "https://api.themoviedb.org";

const queryClient = new QueryClient();

const ApiContext = createContext({});

export let activeFilter: MovieListQuery = {};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ApiContext.Provider value={{}}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApiContext.Provider>
  );
};

export const useApiContext = () => useContext(ApiContext);

export const useMoviesList = (
  params: MovieListQuery,
  options?: any
): UseQueryResult<Movie[], Error> => {
  return useQuery({
    queryKey: [params],
    queryFn: async () => {
      activeFilter = params;
      const { data } = await axios.get(`${BASEURL}/movies/list`, {
        params: params,
        paramsSerializer: { indexes: null },
      });
      return data as Movie[];
    },
    retry: 0,
    ...options,
  });
};

export const useMovieGet = (
  params: MovieGetQuery,
  options?: any
): UseQueryResult<Movie, Error> => {
  return useQuery({
    queryKey: [params],
    queryFn: async () => {
      const { data } = await axios.get(`${BASEURL}/movies/get`, {
        params: params,
      });
      return data as Movie;
    },
    retry: 0,
    ...options,
  });
};

export const useMovieListById = (
  params: MovieListByIdQuery,
  options?: any
): UseQueryResult<Movie[], Error> => {
  return useQuery({
    queryKey: [params],
    queryFn: async () => {
      const { data } = await axios.get(`${BASEURL}/movies/list/id`, {
        params: params,
        paramsSerializer: { indexes: null },
      });
      return data as Movie[];
    },
    retry: 0,
    ...options,
  });
};

export const useTypesList = (options?: any): UseQueryResult<AllType, Error> => {
  return useQuery({
    queryKey: ["useTypesList"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASEURL}/types/list`);
      return data as AllType;
    },
    retry: 0,
    ...options,
  });
};

export const useMovieCount = (options?: any): UseQueryResult<number, Error> => {
  return useQuery({
    queryKey: ["useMovieCount"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASEURL}/movies/count`);
      return data as number;
    },
    retry: 0,
    ...options,
  });
};

export const useGetRecentMovies = (
  params?: MostRecentMovieQuery,
  options?: any
): UseQueryResult<Movie[], Error> => {
  return useQuery({
    queryKey: ["useGetRecentMovies"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASEURL}/movies/mostRecent`, {
        params: params,
      });
      return data as Movie[];
    },
    retry: 0,
    ...options,
  });
};

export const useGetNowPlaying = (
  options?: any
): UseQueryResult<TMDBMovie[], Error> => {
  return useQuery({
    queryKey: ["useGetNowPlaying"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${TMDBURL}/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDBKEY}&region=US`
      );
      return data.results as TMDBMovie[];
    },
    retry: 0,
    ...options,
  });
};

export const useGetUpcoming = (
  options?: any
): UseQueryResult<TMDBMovie[], Error> => {
  return useQuery({
    queryKey: ["useGetUpcoming"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${TMDBURL}/3/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_TMDBKEY}&region=US`
      );
      return data.results as TMDBMovie[];
    },
    retry: 0,
    ...options,
  });
};
