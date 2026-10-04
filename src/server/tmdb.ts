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

export const fetchPerson = async (name: string): Promise<TMDBPerson | null> => {
  const { results } = await tmdb<{ results: TMDBPersonResult[] }>(
    "/search/person",
    { query: name },
  );
  return results[0] ? tmdb<TMDBPerson>(`/person/${results[0].id}`) : null;
};
