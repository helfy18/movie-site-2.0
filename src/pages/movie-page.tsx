/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/components/layout";
import { useMovieGet } from "@/contexts/apiContext";
import { Grid } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MoviePage = () => {
  const [movie, setMovie] = useState<Movie>();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const year = searchParams.get("year");
  const params: MovieGetQuery = {
    title: title ?? undefined,
    tmdbid: id ? parseInt(id) : undefined,
    year: year ?? undefined,
  };

  const movieGet = useMovieGet(params, {
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (movieGet.isSuccess) {
      setMovie(movieGet.data);
      console.log(movieGet.data);
    } else if (movieGet.isError) {
      console.log(movieGet.error);
    }
  }, [movieGet.isFetching]);

  return (
    <Layout pageTitle={`Movie`}>
      <Grid container spacing={2.5}></Grid>
    </Layout>
  );
};

export default MoviePage;
