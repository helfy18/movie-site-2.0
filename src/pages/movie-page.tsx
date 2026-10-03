import type { GetServerSideProps } from "next";
import { fetchMovie, hasServerResponse } from "@/api/client";

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = first(query.id);
  if (id) {
    return { redirect: { destination: `/movie/${id}`, permanent: true } };
  }

  const title = first(query.title);
  const year = first(query.year);
  if (title && year) {
    try {
      const movie = await fetchMovie({ title, year });
      return {
        redirect: { destination: `/movie/${movie.tmdbid}`, permanent: false },
      };
    } catch (error) {
      if (!hasServerResponse(error)) throw error;
    }
  }

  return { notFound: true };
};

const LegacyMoviePage = () => null;

export default LegacyMoviePage;
