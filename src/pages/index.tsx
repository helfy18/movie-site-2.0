import { useMemo, useState } from "react";
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

const isChristmas = (): Boolean => {
  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    today >= new Date(currentYear, 10, 1) &&
    today <= new Date(currentYear, 11, 31)
  );
};

const isHalloween = (): Boolean => {
  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    today >= new Date(currentYear, 9, 1) &&
    today <= new Date(currentYear, 10, 5)
  );
};

const withRatings = (
  tmdbMovies: TMDBMovie[] | undefined,
  ratedById: Map<number, Movie> | undefined,
): Movie[] =>
  tmdbMovies && ratedById
    ? tmdbMovies.map(
        (movie) => ratedById.get(movie.id) ?? generateEmptyMovie(movie),
      )
    : [];

const IndexPage = () => {
  const [params, setParams] = useState<MovieListQuery>({});

  const getRecentMovies = useGetRecentMovies(
    {},
    { refetchOnWindowFocus: false },
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
    },
  );
  const movieList = useMoviesList(params, {
    enabled: !!getNowPlaying.isSuccess,
    refetchOnWindowFocus: false,
  });

  const latestYear = useMemo(
    () =>
      movieList.data && movieList.data.length > 0
        ? Math.max(...movieList.data.map((movie) => movie.year))
        : undefined,
    [movieList.data],
  );

  const ratedById = useMemo(
    () =>
      getMoviesById.data &&
      new Map(getMoviesById.data.map((movie) => [movie.tmdbid, movie])),
    [getMoviesById.data],
  );
  const nowPlaying = useMemo(
    () => withRatings(getNowPlaying.data, ratedById),
    [getNowPlaying.data, ratedById],
  );
  const upcoming = useMemo(
    () => withRatings(getUpcoming.data, ratedById),
    [getUpcoming.data, ratedById],
  );

  return (
    <Layout pageTitle="Home">
      {getRecentMovies.data && (
        <PosterRow title="Recently Added" movies={getRecentMovies.data} />
      )}
      {nowPlaying.length > 0 && (
        <PosterRow title="Now Playing in Theatres" movies={nowPlaying} />
      )}
      {upcoming.length > 0 && (
        <PosterRow title="Coming Soon to Theatres" movies={upcoming} />
      )}
      {movieList.isLoading && <Spinner />}
      {movieList.data && (
        <>
          {isChristmas() && (
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
          )}
          {isHalloween() && (
            <PosterRow
              title="Best Halloween Movies"
              movies={movieList.data
                .filter((movie) => {
                  return movie.holiday === "Halloween";
                })
                .slice(0, 20)}
              link={{
                url: "/movie-grid",
                onClick: () => {
                  setParams({
                    holiday: ["Halloween"],
                  });
                },
              }}
            />
          )}
          <PosterRow
            title="Best of This Year"
            movies={movieList.data
              .filter((movie) => movie.year === latestYear)
              .slice(0, 20)}
            link={{
              url: "/movie-grid",
              onClick: () => {
                setParams({
                  year: [String(latestYear)],
                });
              },
            }}
          />
          <PosterRow
            title="Best of Last Year"
            movies={movieList.data
              .filter((movie) => movie.year === (latestYear ?? 0) - 1)
              .slice(0, 20)}
            link={{
              url: "/movie-grid",
              onClick: () => {
                setParams({
                  year: [String((latestYear ?? 0) - 1)],
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
              (movie) => movie.sub_universe === "MCU",
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
