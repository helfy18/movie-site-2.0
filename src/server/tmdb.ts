import { buildUrl, getJson } from "@/api/client";

const TMDBURL = "https://api.themoviedb.org/3";

const tmdb = <T>(path: string) =>
  getJson<T>(
    buildUrl(TMDBURL, path, {
      api_key: process.env.TMDB_KEY ?? process.env.NEXT_PUBLIC_TMDBKEY,
      region: "US",
    }),
  );

const results = async (path: string) =>
  (await tmdb<{ results: TMDBMovie[] }>(path)).results;

export const fetchNowPlaying = () => results("/movie/now_playing");
export const fetchUpcoming = () => results("/movie/upcoming");
