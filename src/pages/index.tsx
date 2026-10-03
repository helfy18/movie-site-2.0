import type { GetStaticProps } from "next";
import Layout from "../components/layout";
import {
  fetchMoviesById,
  fetchMoviesList,
  fetchRecentMovies,
} from "@/api/client";
import { fetchNowPlaying, fetchUpcoming } from "@/server/tmdb";
import PosterRow from "@/components/posterRow";
import { gridLink, toPosterMovie } from "@/utils";
import { buildRows, withRatings, type Row } from "@/homeRows";

interface Props {
  recent: PosterMovie[];
  nowPlaying: PosterMovie[];
  upcoming: PosterMovie[];
  rows: Row[];
}

const theatreListings = async () => {
  try {
    return await Promise.all([fetchNowPlaying(), fetchUpcoming()]);
  } catch {
    return [[], []] as [TMDBMovie[], TMDBMovie[]];
  }
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [recent, catalogue, [nowPlayingTmdb, upcomingTmdb]] = await Promise.all(
    [fetchRecentMovies(), fetchMoviesList({}), theatreListings()],
  );

  const theatreIds = [...nowPlayingTmdb, ...upcomingTmdb].map((m) => m.id);
  const rated =
    theatreIds.length > 0 ? await fetchMoviesById({ tmdbid: theatreIds }) : [];
  const ratedById = new Map(rated.map((movie) => [movie.tmdbid, movie]));

  return {
    props: {
      recent: recent.map(toPosterMovie),
      nowPlaying: withRatings(nowPlayingTmdb, ratedById),
      upcoming: withRatings(upcomingTmdb, ratedById),
      rows: buildRows(catalogue, new Date()),
    },
    revalidate: 900,
  };
};

const IndexPage = ({ recent, nowPlaying, upcoming, rows }: Props) => (
  <Layout pageTitle="Home">
    {recent.length > 0 && <PosterRow title="Recently Added" movies={recent} />}
    {nowPlaying.length > 0 && (
      <PosterRow title="Now Playing in Theatres" movies={nowPlaying} />
    )}
    {upcoming.length > 0 && (
      <PosterRow title="Coming Soon to Theatres" movies={upcoming} />
    )}
    {rows.map((row) => (
      <PosterRow
        key={row.title}
        title={row.title}
        movies={row.movies}
        link={gridLink(row.link)}
      />
    ))}
  </Layout>
);

export default IndexPage;
