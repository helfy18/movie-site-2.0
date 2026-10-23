import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import { fetchMovie, hasServerResponse } from "@/api/client";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

// Client-side replacement for the old /movie-page?title=&year= lookup.
// The ?id= form is a plain redirect rule in public/_redirects; it is also
// handled here in case a link reaches this page directly.
const FindPage = () => {
  const router = useRouter();
  const [lookupFailed, setLookupFailed] = useState(false);

  const id = first(router.query.id);
  const title = first(router.query.title);
  const year = first(router.query.year);
  const missing = router.isReady && !id && !(title && year);
  const failed = missing || lookupFailed;

  useEffect(() => {
    if (!router.isReady) return;
    if (id) {
      router.replace(`/movie/${id}`);
      return;
    }
    if (!title || !year) return;
    fetchMovie({ title, year })
      .then((movie) => router.replace(`/movie/${movie.tmdbid}`))
      .catch((error) => {
        if (!hasServerResponse(error)) throw error;
        setLookupFailed(true);
      });
  }, [router, id, title, year]);

  return (
    <Layout pageTitle="Finding movie">
      {failed ? (
        <Typography
          sx={{ color: "secondary.main", textAlign: "center", mt: 8 }}
        >
          Movie not found.
        </Typography>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default FindPage;
