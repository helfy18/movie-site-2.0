import type { GetStaticProps } from "next";
import Layout from "../components/layout";
import {
  fetchMoviesById,
  fetchMoviesList,
  fetchRecentMovies,
} from "@/contexts/apiContext";
import { fetchNowPlaying, fetchUpcoming } from "@/server/tmdb";
import PosterRow from "@/components/posterRow";
import { generateEmptyMovie, gridLink } from "@/utils";

interface Row {
  title: string;
  movies: Movie[];
  link: MovieListQuery;
}

interface Props {
  recent: Movie[];
  nowPlaying: Movie[];
  upcoming: Movie[];
  rows: Row[];
}

const isChristmas = (today: Date): boolean => {
  const year = today.getFullYear();
  return today >= new Date(year, 10, 1) && today < new Date(year + 1, 0, 1);
};

const isHalloween = (today: Date): boolean => {
  const year = today.getFullYear();
  return today >= new Date(year, 9, 1) && today < new Date(year, 10, 1);
};

const withRatings = (
  tmdbMovies: TMDBMovie[],
  ratedById: Map<number, Movie>,
): Movie[] =>
  tmdbMovies.flatMap((movie) => {
    const rated = ratedById.get(movie.id);
    if (rated) return [rated];
    return movie.poster_path ? [generateEmptyMovie(movie)] : [];
  });

const theatreListings = async () => {
  try {
    return await Promise.all([fetchNowPlaying(), fetchUpcoming()]);
  } catch {
    return [[], []] as [TMDBMovie[], TMDBMovie[]];
  }
};

const buildRows = (catalogue: Movie[], today: Date): Row[] => {
  const top = (test: (movie: Movie) => boolean) =>
    catalogue.filter(test).slice(0, 20);
  const latestYear = Math.max(...catalogue.map((movie) => movie.year));
  const lastYear = latestYear - 1;

  const rows: Row[] = [];
  if (isChristmas(today)) {
    rows.push({
      title: "Best Christmas Movies",
      movies: top((m) => m.holiday === "Christmas"),
      link: { holiday: ["Christmas"] },
    });
  }
  if (isHalloween(today)) {
    rows.push({
      title: "Best Halloween Movies",
      movies: top((m) => m.holiday === "Halloween"),
      link: { holiday: ["Halloween"] },
    });
  }
  rows.push(
    {
      title: "Best of This Year",
      movies: top((m) => m.year === latestYear),
      link: { year: [String(latestYear)] },
    },
    {
      title: "Best of Last Year",
      movies: top((m) => m.year === lastYear),
      link: { year: [String(lastYear)] },
    },
    {
      title: "Best of the 80's",
      movies: top((m) => m.year >= 1980 && m.year <= 1989),
      link: { decade: ["1980-1989"] },
    },
    {
      title: "Best of the 90's",
      movies: top((m) => m.year >= 1990 && m.year <= 1999),
      link: { decade: ["1990-1999"] },
    },
    {
      title: "Marvel Cinematic Universe",
      movies: catalogue.filter((m) => m.sub_universe === "MCU"),
      link: { universe: ["MCU"] },
    },
  );
  return rows;
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
      recent,
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
