import { fetchMoviesListCompact, hasServerResponse } from "@/api/client";
import { fetchPerson } from "@/server/tmdb";
import { sitemapPeople, toFilmographyMovie } from "@/utils";
import PersonDetail, {
  type PersonDetailProps,
} from "@/components/personDetail";
import type { GetStaticPaths, GetStaticProps } from "next";

// Static export: people with enough appearances are built as files; the
// long tail is served by the client-side shell via the /person/* rewrite.
export const getStaticPaths: GetStaticPaths = async () => {
  const movies = await fetchMoviesListCompact({});
  return {
    paths: sitemapPeople(movies).map((name) => ({ params: { name } })),
    fallback: false,
  };
};

export const loadPerson = async (
  name: string,
): Promise<PersonDetailProps | null> => {
  const [directed, actedIn] = await Promise.all([
    fetchMoviesListCompact({ director: [name] }),
    fetchMoviesListCompact({ actor: [name] }),
  ]);
  if (directed.length === 0 && actedIn.length === 0) return null;
  const person = await fetchPerson(name).catch(() => null);
  return {
    name,
    person,
    directed: directed.map((movie) => toFilmographyMovie(movie, name)),
    actedIn: actedIn.map((movie) => toFilmographyMovie(movie, name)),
  };
};

export const getStaticProps: GetStaticProps<
  PersonDetailProps,
  { name: string }
> = async ({ params }) => {
  const name = params?.name;
  if (!name) return { notFound: true };
  try {
    const props = await loadPerson(name);
    return props ? { props } : { notFound: true };
  } catch (error) {
    if (hasServerResponse(error)) return { notFound: true };
    throw error;
  }
};

const PersonPage = (props: PersonDetailProps) => <PersonDetail {...props} />;

export default PersonPage;
