/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/components/layout";
import {
  useMovieCount,
  useMovieGet,
  useMovieListById,
} from "@/contexts/apiContext";
import { Box, Grid2, Paper, styled } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { gradient, PosterItem } from "@/components/movieGrid";
import Link from "next/link";
import InfoTable from "@/components/infoTable";
import ProviderTable from "@/components/providerTable";
import Spinner from "@/components/spinner";
import OtherSiteReviews from "@/components/otherSiteReviews";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "#44403c",
  fontSize: "16px",
}));

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
  const [recommended, setRecommended] = useState<Movie[]>([]);

  const movieGet = useMovieGet(params, {
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

  const getTotalCount = useMovieCount({ refetchOnWindowFocus: false });
  console.log(movie);

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

  return (
    <Layout pageTitle="Movie">
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
                }}
              >
                <Image
                  src={movie.poster}
                  width="275"
                  height="400"
                  alt="Not Found"
                  layout="responsive"
                />
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
            <Grid2 size={{ sm: 12, md: 5 }} className="space-y-4">
              <InfoTable movie={movie} />
              <ProviderTable movie={movie} />
            </Grid2>
            <Grid2 size={{ sm: 12, md: 4.2 }} className="space-y-4">
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
            </Grid2>
          </Grid2>
          <header className="text-center w-full font-bold text-xl my-2">
            More Like This
          </header>
          <Grid2
            container
            spacing={2}
            wrap="nowrap"
            style={{ overflowX: "scroll" }}
          >
            {recommended.map((recommendation) => {
              return (
                movie && (
                  <Grid2
                    size={{ xs: "auto" }}
                    key={recommendation.tmdbid}
                    mb={1}
                  >
                    <Link
                      href={`/movie-page?id=${recommendation.tmdbid}`}
                      style={{ textDecoration: "none" }}
                    >
                      <PosterItem>
                        <Image
                          src={recommendation.poster}
                          height={163}
                          width={110}
                          alt="Not Found"
                        />
                        <Box
                          style={{
                            color: gradient[recommendation.jh_score],
                            fontWeight: "bolder",
                          }}
                        >
                          {recommendation.jh_score}/100
                        </Box>
                        <Box>{recommendation.movie}</Box>
                      </PosterItem>
                    </Link>
                  </Grid2>
                )
              );
            })}
          </Grid2>
        </>
      )}
    </Layout>
  );
};

export default MoviePage;
