/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/components/layout";
import {
  useMovieCount,
  useMovieGet,
  useMovieListById,
  useMoviesList,
} from "@/contexts/apiContext";
import { Box, Grid2, Paper, Stack, styled, Tooltip } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { gradient } from "@/components/movieGrid";
import InfoTable from "@/components/infoTable";
import ProviderTable from "@/components/providerTable";
import Spinner from "@/components/spinner";
import OtherSiteReviews from "@/components/otherSiteReviews";
import PosterRow from "@/components/posterRow";

export const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "#44403c",
  fontSize: "16px",
}));

const MoviePage = () => {
  const [movie, setMovie] = useState<Movie>();
  const [params, setParams] = useState<MovieListQuery>({});
  const [recommended, setRecommended] = useState<Movie[]>([]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const year = searchParams.get("year");
  const getParams: MovieGetQuery = {
    title: title ?? undefined,
    tmdbid: id ? parseInt(id) : undefined,
    year: year ?? undefined,
  };

  const movieGet = useMovieGet(getParams, {
    enabled: !!id || (!!title && !!year),
    refetchOnWindowFocus: false,
  });

  const useMovieList = useMovieListById(
    { tmdbid: movie?.recommendations || [] },
    {
      enabled: !!movie,
      refetchOnWindowFocus: false,
    }
  );

  const listMovies = useMoviesList(params, {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const getTotalCount = useMovieCount({ refetchOnWindowFocus: false });

  useEffect(() => {
    if (movieGet.isSuccess) {
      setMovie(movieGet.data);
    } else if (movieGet.isError) {
      console.log(movieGet.error);
    }
  }, [movieGet.isFetching]);

  useEffect(() => {
    if (useMovieList.isSuccess) {
      setRecommended(useMovieList.data);
    } else if (useMovieList.isError) {
      console.log(movieGet.error);
    }
  }, [useMovieList.isFetching]);

  const infoTableClick = (value: string | number, queryType: string) => {
    setParams({ [queryType]: [value] });
  };

  useEffect(() => {
    if (Object.keys(params).length > 0) listMovies.refetch();
  }, [params]);

  useEffect(() => {
    setMovie(undefined);
    setRecommended([]);
  }, [id]);

  return (
    <Layout pageTitle={movie?.movie || "Movie Page"}>
      {movieGet.isLoading && <Spinner />}
      {!movieGet.isLoading && !movie && (
        <Box className="flex justify-center items-center h-[80vh] w-full">
          Not Found
        </Box>
      )}
      {movie && (
        <>
          <Grid2 container className="flex flex-wrap" spacing={2.5}>
            <Grid2
              size={{ xs: 12, md: 2.8 }}
              textAlign="center"
              className="space-y-4"
            >
              <Box
                sx={{
                  px: { xs: "2rem", md: "0rem" },
                  position: "relative",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <Image
                  src={movie.poster.replace("w500", "original")}
                  width="275"
                  height="400"
                  alt="Not Found"
                  layout="responsive"
                  placeholder="blur"
                  blurDataURL="/spin.svg"
                  className="rounded"
                />
                {movie.dani_approved && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: { xs: 32, md: 0 },
                      width: 60,
                      height: 60,
                    }}
                  >
                    <Tooltip title="Dani Approved" arrow>
                      <Image
                        src="/greencheck.png"
                        alt="Verified"
                        width={60}
                        height={60}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  </Box>
                )}
              </Box>
              <Box className="w-100 flex items-center justify-center">
                <Item
                  sx={{
                    textAlign: "center",
                    color: "secondary.main",
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "1.3em",
                    width: "fit-content",
                    fontWeight: "bold",
                  }}
                >
                  Ranking:
                  <Box
                    style={{
                      color: gradient[movie.jh_score],
                    }}
                  >
                    {movie.ranking}
                  </Box>
                  <Box className="relative">
                    <hr
                      className="absolute top-1/2 w-full"
                      style={{
                        borderColor: gradient[movie.jh_score],
                      }}
                    />
                  </Box>
                  <Box
                    style={{
                      color: gradient[movie.jh_score],
                    }}
                  >
                    {getTotalCount.data}
                  </Box>
                </Item>
              </Box>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 5 }}>
              <Stack spacing={2}>
                <InfoTable movie={movie} onClick={infoTableClick} />
                <ProviderTable movie={movie} />
              </Stack>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 4.2 }}>
              <Stack spacing={2}>
                {movie.trailer && (
                  <div className="w-full aspect-[16/9]">
                    <iframe
                      src={movie.trailer}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title="video"
                      className="w-full h-full"
                    />
                  </div>
                )}
                <Item
                  sx={{
                    color: "secondary.main",
                  }}
                >
                  Plot:
                  <br />
                  {movie.plot}
                </Item>
                {movie.review && (
                  <Item
                    sx={{
                      color: "secondary.main",
                    }}
                  >
                    Review:
                    <br />
                    {movie.review}
                  </Item>
                )}
                <OtherSiteReviews movie={movie} />
              </Stack>
            </Grid2>
          </Grid2>
          {recommended && (
            <PosterRow title="More Like This" movies={recommended} />
          )}
        </>
      )}
    </Layout>
  );
};

export default MoviePage;
