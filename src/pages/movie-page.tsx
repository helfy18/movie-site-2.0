/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/components/layout";
import {
  useMovieCount,
  useMovieGet,
  useMovieListById,
} from "@/contexts/apiContext";
import { Box, CircularProgress, Grid, Paper, styled } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { gradient, PosterItem } from "@/components/movieGrid";
import { getProviderLink } from "@/utils";
import Link from "next/link";
import InfoTable from "@/components/infoTable";

function getReview(review: string | undefined) {
  return (
    review && (
      <Item>
        Review:
        <br />
        {review}
      </Item>
    )
  );
}

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  fontFamily: "Arial",
  color: "#eab308",
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
      {movieGet.isLoading && (
        <Box className="flex justify-center items-center h-[80vh] w-full">
          <CircularProgress color="secondary" />
        </Box>
      )}
      {!movieGet.isLoading && !movie && (
        <Box className="flex justify-center items-center h-[80vh] w-full">
          Not Found
        </Box>
      )}
      {movie && (
        <>
          <Grid container className="flex flex-wrap" spacing={2.5}>
            <Grid item xs textAlign="center" className="space-y-4">
              <Image
                src={movie.poster}
                width="275"
                height="400"
                alt="Not Found"
                className="mx-auto"
              />
              <div className="w-100 flex items-center justify-center">
                <Item className="text-center flex flex-col text-xl w-fit font-mono font-black">
                  Ranking:
                  <span
                    style={{
                      color: gradient[movie.jh_score],
                    }}
                  >
                    {movie.ranking}
                  </span>
                  <span className="relative">
                    <hr
                      className="absolute top-1/2 w-full"
                      style={{
                        borderColor: gradient[movie.jh_score],
                        borderTopWidth: "1px",
                      }}
                    />
                  </span>
                  <span
                    style={{
                      color: gradient[movie.jh_score],
                    }}
                  >
                    {getTotalCount.data}
                  </span>
                </Item>
              </div>
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
            </Grid>
            <Grid item sm={12} md={5} className="space-y-4">
              <InfoTable movie={movie} />
              <table>
                <thead>
                  <tr>
                    <th colSpan={2}>
                      Providers - Brought to You By JustWatch.com
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key="stream">
                    <td>With Account</td>
                    <td className="flex flex-wrap gap-0.5">
                      {movie.provider.flatrate?.map((provider, index) => {
                        return (
                          <Link
                            href={getProviderLink(provider.provider_id)}
                            target="_blank"
                            className="pr-4"
                            rel="noopener noreferrer"
                            key={index}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w154/${provider.logo_path}`}
                              height={45}
                              width={45}
                              alt="provider"
                            />
                          </Link>
                        );
                      })}
                    </td>
                  </tr>
                  <tr key="rent">
                    <td>For Rent</td>
                    <td className="flex flex-wrap gap-0.5">
                      {movie.provider.rent?.map((provider, index) => {
                        return (
                          <Link
                            href={getProviderLink(provider.provider_id)}
                            target="_blank"
                            className="pr-4"
                            rel="noopener noreferrer"
                            key={`rent-${index}`}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w154/${provider.logo_path}`}
                              height={45}
                              width={45}
                              alt="provider"
                            />
                          </Link>
                        );
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Grid>
            <Grid
              item
              sm={12}
              margin={"1rem"}
              marginTop={0}
              lg
              textAlign="center"
            >
              <Item>
                Plot:
                <br />
                {movie.plot}
              </Item>
              <br />
              {getReview(movie.review)}
              <br />
              <table>
                <tbody>
                  {movie.ratings.map((rating) => {
                    switch (rating.source) {
                      case "Internet Movie Database":
                        return (
                          <tr key="imdb">
                            <td>
                              <div className="flex justify-center">
                                <Image
                                  src="/imdb.png"
                                  height={40}
                                  width={80}
                                  alt="IMDB"
                                />
                              </div>
                            </td>
                            <td>{rating.value}</td>
                          </tr>
                        );
                      case "Rotten Tomatoes":
                        return (
                          <tr key="rt">
                            <td>
                              <div className="flex justify-center">
                                <Image
                                  src="/rt.png"
                                  height={40}
                                  width={140}
                                  alt="Rotten Tomatoes"
                                />
                              </div>
                            </td>
                            <td>{rating.value}</td>
                          </tr>
                        );
                      case "Metacritic":
                        return (
                          <tr key="metacritic">
                            <td>
                              <div className="flex justify-center">
                                <Image
                                  src="/metacritic.png"
                                  height={40}
                                  width={175}
                                  alt="Metacritic"
                                />
                              </div>
                            </td>
                            <td>{rating.value}</td>
                          </tr>
                        );
                      default:
                        return <tr />;
                    }
                  })}
                </tbody>
              </table>
            </Grid>
          </Grid>
          <header className="text-center w-full font-bold text-xl">
            More Like This
          </header>
          <Grid
            container
            spacing={2}
            wrap="nowrap"
            style={{ overflowX: "scroll" }}
          >
            {recommended.map((recommendation) => {
              return (
                movie && (
                  <Grid item xs={"auto"} key={recommendation.tmdbid}>
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
                        <div
                          style={{
                            color: gradient[recommendation.jh_score],
                            fontWeight: "bolder",
                          }}
                        >
                          {recommendation.jh_score}/100
                        </div>
                        <div>{recommendation.movie}</div>
                      </PosterItem>
                    </Link>
                  </Grid>
                )
              );
            })}
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default MoviePage;
