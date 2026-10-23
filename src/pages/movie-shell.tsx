import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import MovieDetail from "@/components/movieDetail";
import {
  fetchMovie,
  fetchMoviesById,
  hasServerResponse,
  isNotFound,
} from "@/api/client";
import { fetchTmdbMovie } from "@/server/tmdb";
import { useMovieCount } from "@/api/hooks";
import { toPosterMovie } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";

// Served for any /movie/<id> that was not pre-rendered (see public/_redirects).
// Fetches the ratings API first, then TMDB, in the browser. router.asPath
// carries the real URL once hydration has finished (router.isReady).
const idFromPath = (path: string) => {
  const match = path.match(/\/movie\/(\d+)/);
  return match ? Number(match[1]) : null;
};

const loadMovie = async (id: number) => {
  let movie: Movie | null;
  try {
    movie = await fetchMovie({ tmdbid: id });
  } catch (error) {
    if (!hasServerResponse(error) || !isNotFound(error)) throw error;
    movie = await fetchTmdbMovie(id);
  }
  if (!movie) return null;
  const recommended =
    movie.recommendations.length > 0
      ? await fetchMoviesById({ tmdbid: movie.recommendations }).catch(
          () => [] as Movie[],
        )
      : [];
  return { movie, recommended: recommended.map(toPosterMovie) };
};

const Notice = ({ title, message }: { title: string; message: string }) => (
  <Layout pageTitle={title}>
    <Head>
      <meta name="robots" content="noindex" />
    </Head>
    <Typography sx={{ color: "secondary.main", textAlign: "center", mt: 8 }}>
      {message}
    </Typography>
  </Layout>
);

const MovieShell = () => {
  const router = useRouter();
  const id = router.isReady ? idFromPath(router.asPath) : null;

  const query = useQuery({
    queryKey: ["movie-shell", id],
    queryFn: () => loadMovie(id as number),
    enabled: id !== null,
  });
  const count = useMovieCount().data ?? 0;

  const missing = router.isReady && id === null;
  if (missing || query.isError || (query.isSuccess && !query.data)) {
    return <Notice title="Movie not found" message="Movie not found." />;
  }
  if (!query.data) {
    return (
      <Layout pageTitle="Loading">
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Spinner />
      </Layout>
    );
  }
  return (
    <MovieDetail
      movie={query.data.movie}
      recommended={query.data.recommended}
      totalCount={count}
    />
  );
};

export default MovieShell;
