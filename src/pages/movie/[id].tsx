import {
  fetchMovie,
  fetchMovieCount,
  fetchMoviesById,
  fetchMoviesListCompact,
  hasServerResponse,
  isNotFound,
} from "@/api/client";
import { fetchNowPlaying, fetchTmdbMovie, fetchUpcoming } from "@/server/tmdb";
import MovieDetail, { type MovieDetailProps } from "@/components/movieDetail";
import type { GetStaticPaths, GetStaticProps } from "next";

// Static export: every rated movie plus whatever is currently in theatres
// (now playing + upcoming) is built as a file. Anything else is served by
// the client-side shell via the /movie/* rewrite in public/_redirects.
export const getStaticPaths: GetStaticPaths = async () => {
  const [movies, nowPlaying, upcoming] = await Promise.all([
    fetchMoviesListCompact({}),
    fetchNowPlaying().catch(() => [] as TMDBMovie[]),
    fetchUpcoming().catch(() => [] as TMDBMovie[]),
  ]);
  const ids = new Set<number>([
    ...movies.map((movie) => movie.tmdbid),
    ...[...nowPlaying, ...upcoming].map((movie) => movie.id),
  ]);
  return {
    paths: [...ids].map((id) => ({ params: { id: String(id) } })),
    fallback: false,
  };
};

// The catalogue size is the same for every page in a build; fetch it once.
let movieCountPromise: Promise<number> | undefined;
const cachedMovieCount = () =>
  (movieCountPromise ??= fetchMovieCount().catch((error) => {
    movieCountPromise = undefined;
    throw error;
  }));

export const getStaticProps: GetStaticProps<
  MovieDetailProps,
  { id: string }
> = async ({ params }) => {
  const id = Number(params?.id);
  if (!Number.isInteger(id) || id <= 0) return { notFound: true };

  let movie: Movie;
  try {
    movie = await fetchMovie({ tmdbid: id });
  } catch (error) {
    // Only a definite miss falls through to TMDB, so an outage on the
    // ratings API never builds the unreviewed version of a rated movie.
    if (!hasServerResponse(error)) throw error;
    if (!isNotFound(error)) return { notFound: true };
    const fallback = await fetchTmdbMovie(id).catch(() => null);
    if (!fallback) return { notFound: true };
    movie = fallback;
  }

  const [recommended, totalCount] = await Promise.all([
    movie.recommendations.length > 0
      ? fetchMoviesById({ tmdbid: movie.recommendations })
      : [],
    cachedMovieCount(),
  ]);

  return { props: { movie, recommended, totalCount } };
};

const MoviePage = (props: MovieDetailProps) => <MovieDetail {...props} />;

export default MoviePage;
