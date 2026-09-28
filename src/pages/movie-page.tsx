import Layout from "@/components/layout";
import {
  useMovieCount,
  useMovieGet,
  useMovieListById,
  useMoviesList,
} from "@/contexts/apiContext";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  Paper,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { scoreColor } from "@/styles/gradient";
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

const queryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const MoviePage = () => {
  const [params, setParams] = useState<MovieListQuery>({});
  const [showImage, setShowImage] = useState(false);

  const router = useRouter();
  const id = queryValue(router.query.id);
  const title = queryValue(router.query.title);
  const year = queryValue(router.query.year);
  const hasParams = !!id || (!!title && !!year);
  const getParams: MovieGetQuery = {
    title,
    tmdbid: id ? parseInt(id) : undefined,
    year,
  };

  const movieGet = useMovieGet(getParams, {
    enabled: router.isReady && hasParams,
    refetchOnWindowFocus: false,
  });
  const movie = movieGet.data;

  const recommendedMovies = useMovieListById(
    { tmdbid: movie?.recommendations || [] },
    {
      enabled: !!movie,
      refetchOnWindowFocus: false,
    },
  );
  const recommended = recommendedMovies.data ?? [];

  const listMovies = useMoviesList(params, {
    enabled: false,
    refetchOnWindowFocus: false,
  });
  const { refetch: refetchList } = listMovies;

  const getTotalCount = useMovieCount({ refetchOnWindowFocus: false });

  const infoTableClick = (value: string | number, queryType: string) => {
    setParams({ [queryType]: [value] });
  };

  useEffect(() => {
    if (Object.keys(params).length > 0) refetchList();
  }, [params, refetchList]);

  const loading = !router.isReady || (hasParams && movieGet.isPending);
  const notFound = router.isReady && (!hasParams || movieGet.isError);

  return (
    <Layout pageTitle={movie?.movie || "Movie Page"}>
      {loading && <Spinner />}
      {notFound && (
        <Box className="flex justify-center items-center h-[80vh] w-full">
          Not Found
        </Box>
      )}
      {showImage && (
        <Dialog
          open={showImage}
          onClose={() => setShowImage(false)}
          PaperProps={{
            style: {
              backgroundColor: "#292524",
            },
          }}
        >
          <DialogTitle color="#eab308" align="center">
            Dani Approved
          </DialogTitle>
          <DialogContent>
            <Stack spacing={1} alignItems="center">
              <Image src="/dani.png" alt="verified" width="300" height="300" />
              <Typography variant="body2" color="secondary">
                Drawing Credit: Phoebe Torres
              </Typography>
            </Stack>
          </DialogContent>
        </Dialog>
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
                      width: 100,
                      height: 100,
                    }}
                    onClick={() => setShowImage(true)}
                  >
                    <Tooltip title="Dani Approved" arrow>
                      <Image
                        src="/dani.png"
                        alt="Verified"
                        fill
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
                      color: scoreColor(movie.jh_score),
                    }}
                  >
                    {movie.ranking}
                  </Box>
                  <Box className="relative">
                    <hr
                      className="absolute top-1/2 w-full"
                      style={{
                        borderColor: scoreColor(movie.jh_score),
                      }}
                    />
                  </Box>
                  <Box
                    style={{
                      color: scoreColor(movie.jh_score),
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
          {recommended.length > 0 && (
            <PosterRow title="More Like This" movies={recommended} />
          )}
        </>
      )}
    </Layout>
  );
};

export default MoviePage;
