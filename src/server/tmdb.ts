import { buildUrl, getJson } from "@/api/client";

const TMDBURL = "https://api.themoviedb.org/3";

const tmdb = <T>(path: string, params?: object) =>
  getJson<T>(
    buildUrl(TMDBURL, path, {
      api_key: process.env.TMDB_KEY ?? process.env.NEXT_PUBLIC_TMDBKEY,
      region: "US",
      ...params,
    }),
  );

const results = async (path: string) =>
  (await tmdb<{ results: TMDBMovie[] }>(path)).results;

export const fetchNowPlaying = () => results("/movie/now_playing");
export const fetchUpcoming = () => results("/movie/upcoming");

const CAST_LIMIT = 20;

const image = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : "";

const toProviders = (country?: TMDBProviderCountry): Providers => ({
  link: country?.link ?? "",
  flatrate: country?.flatrate ?? [],
  rent: country?.rent ?? [],
  buy: country?.buy ?? [],
  ads: country?.ads ?? [],
  free: country?.free ?? [],
});

// Movies not in the ratings API are shown straight from TMDB; jh_score -1
// marks them unreviewed throughout the site.
export const fetchTmdbMovie = async (tmdbid: number): Promise<Movie | null> => {
  const detail = await tmdb<TMDBMovieDetail>(`/movie/${tmdbid}`, {
    append_to_response:
      "credits,videos,watch/providers,release_dates,recommendations",
  });
  if (detail.adult) return null;

  const usReleases = detail.release_dates.results.find(
    (release) => release.iso_3166_1 === "US",
  );
  const trailer = detail.videos.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  return {
    movie: detail.title,
    jh_score: -1,
    poster: image(detail.poster_path),
    tmdbid: detail.id,
    dani_approved: false,
    genre: detail.genres[0]?.name ?? "",
    genre_2: detail.genres[1]?.name,
    year: detail.release_date ? Number(detail.release_date.slice(0, 4)) : 0,
    ranking: "",
    plot: detail.overview,
    cast: detail.credits.cast.slice(0, CAST_LIMIT).map((person) => person.name),
    directors: detail.credits.crew
      .filter((person) => person.job === "Director")
      .map((person) => person.name),
    ratings: [],
    boxoffice: detail.revenue.toLocaleString("en-US"),
    rated:
      usReleases?.release_dates.find((release) => release.certification)
        ?.certification ?? "",
    runtime: detail.runtime,
    provider: toProviders(detail["watch/providers"].results.US),
    budget: detail.budget.toLocaleString("en-US"),
    recommendations: detail.recommendations.results.map((movie) => movie.id),
    rottentomatoes: "",
    imdb: "",
    metacritic: "",
    trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : "",
  };
};

export const fetchPerson = async (name: string): Promise<TMDBPerson | null> => {
  const { results } = await tmdb<{ results: TMDBPersonResult[] }>(
    "/search/person",
    { query: name },
  );
  return results[0] ? tmdb<TMDBPerson>(`/person/${results[0].id}`) : null;
};
