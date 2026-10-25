import { readFile } from "node:fs/promises";
import { fetchMoviesList } from "@/api/client";

// The full catalogue written by scripts/generate-static.mjs before `next build`.
// Pages that need every movie read it here so the build makes one set of
// API calls instead of one per page; `next dev` falls back to the API.
export const readCatalogue = async (): Promise<Movie[]> => {
  try {
    return JSON.parse(await readFile(".cache/catalogue.json", "utf8"));
  } catch {
    return fetchMoviesList({});
  }
};
