import { useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  useGetNowPlaying,
  useGetRecentMovies,
  useGetUpcoming,
  useMovieListById,
  useMoviesList,
} from "@/contexts/apiContext";
import PosterRow from "@/components/posterRow";
import { generateEmptyMovie } from "@/utils";
import Spinner from "@/components/spinner";

const IndexPage = () => {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [params, setParams] = useState<MovieListQuery>({});

  const getRecentMovies = useGetRecentMovies(
    {},
    { refetchOnWindowFocus: false }
  );
  const getNowPlaying = useGetNowPlaying({ refetchOnWindowFocus: false });
  const getUpcoming = useGetUpcoming({ refetchOnWindowFocus: false });
  const getMoviesById = useMovieListById(
    {
      tmdbid: [
        ...(getNowPlaying.data?.map((movie) => movie.id) || []),
        ...(getUpcoming.data?.map((movie) => movie.id) || []),
      ],
    },
    {
      enabled: !!getNowPlaying.isSuccess,
      refetchOnWindowFocus: false,
    }
  );
  const movieList = useMoviesList(params, {
    enabled: !!getNowPlaying.isSuccess,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (getMoviesById.isSuccess) {
      if (getNowPlaying.data) {
        setNowPlaying(
          getNowPlaying.data.map((movie) => {
            return getMoviesById.data.some((m) => m.tmdbid === movie.id)
              ? getMoviesById.data.filter((m) => m.tmdbid === movie.id)[0]
              : generateEmptyMovie(movie);
          })
        );
      }
      if (getUpcoming.data) {
        setUpcoming(
          getUpcoming.data.map((movie) => {
            return getMoviesById.data.some((m) => m.tmdbid === movie.id)
              ? getMoviesById.data.filter((m) => m.tmdbid === movie.id)[0]
              : generateEmptyMovie(movie);
          })
        );
      }
    }
  }, [getMoviesById.isFetching]);

  return (
    <Layout pageTitle="Home">
      {getRecentMovies.data && (
        <PosterRow title="Recently Added" movies={getRecentMovies.data} />
      )}
      {nowPlaying && (
        <PosterRow title="Now Playing in Theatres" movies={nowPlaying} />
      )}
      {upcoming && (
        <PosterRow title="Coming Soon to Theatres" movies={upcoming} />
      )}
      {movieList.isLoading && <Spinner />}
      {movieList.data && (
        <>
          <PosterRow
            title="Best Christmas Movies"
            movies={movieList.data
              .filter((movie) => {
                return movie.holiday === "Christmas";
              })
              .slice(0, 20)}
            link={{
              url: "/movie-grid",
              onClick: () => {
                setParams({
                  holiday: ["Christmas"],
                });
              },
            }}
          />
          <PosterRow
            title="Best of This Year"
            movies={movieList.data
              .filter((movie) => {
                return (
                  movie.year ===
                  Math.max(...movieList.data.map((movie) => movie.year))
                );
              })
              .slice(0, 20)}
            link={{
              url: "/movie-grid",
              onClick: () => {
                setParams({
                  year: [
                    Math.max(
                      ...movieList.data.map((movie) => movie.year)
                    ).toString(),
                  ],
                });
              },
            }}
          />
          <PosterRow
            title="Best of the 80's"
            movies={movieList.data
              .filter((movie) => {
                return movie.year >= 1980 && movie.year <= 1989;
              })
              .slice(0, 20)}
            link={{
              url: "/movie-grid",
              onClick: () => {
                setParams({
                  decade: ["1980-1989"],
                });
              },
            }}
          />
          <PosterRow
            title="Best of the 90's"
            movies={movieList.data
              .filter((movie) => {
                return movie.year >= 1990 && movie.year <= 1999;
              })
              .slice(0, 20)}
            link={{
              url: "/movie-grid",
              onClick: () => {
                setParams({
                  decade: ["1990-1999"],
                });
              },
            }}
          />
          <PosterRow
            title="Marvel Cinematic Universe"
            movies={movieList.data.filter(
              (movie) => movie.sub_universe === "MCU"
            )}
            link={{
              url: "/movie-grid",
              onClick: () => {
                setParams({
                  universe: ["MCU"],
                });
              },
            }}
          />
        </>
      )}
    </Layout>
  );
};

export default IndexPage;
