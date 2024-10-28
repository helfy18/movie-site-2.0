import React, { createContext, useContext } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";

const BASEURL = process.env.NEXT_PUBLIC_APIURL || "http://localhost:8080";

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
    ...options,
  });
};
