import Layout from "@/components/layout";
import {
  hasServerResponse,
  useMovieCount,
  useMovieGet,
  useMovieListById,
} from "@/contexts/apiContext";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import InfoTable from "@/components/infoTable";
import { Item } from "@/components/item";
import DaniBadge from "@/components/daniBadge";
import ScoreCard from "@/components/scoreCard";
import ProviderTable from "@/components/providerTable";
import Spinner from "@/components/spinner";
import ErrorMessage from "@/components/errorMessage";
import OtherSiteReviews from "@/components/otherSiteReviews";
import PosterRow from "@/components/posterRow";

const queryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const MoviePage = () => {
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
  });
  const movie = movieGet.data;

  const recommendedMovies = useMovieListById(
    { tmdbid: movie?.recommendations || [] },
    {
      enabled: !!movie,
    },
  );
  const recommended = recommendedMovies.data ?? [];

  const getTotalCount = useMovieCount();

  const loading = !router.isReady || (hasParams && movieGet.isPending);
  const unreachable = movieGet.isError && !hasServerResponse(movieGet.error);
  const notFound =
    router.isReady && (!hasParams || (movieGet.isError && !unreachable));

  return (
    <Layout pageTitle={movie?.movie || "Movie Page"} holiday={movie?.holiday}>
      {loading && <Spinner />}
      {unreachable && (
        <ErrorMessage
          message="Couldn't reach the movie database."
          onRetry={() => movieGet.refetch()}
        />
      )}
      {notFound && (
        <Box className="flex justify-center items-center h-[80vh] w-full">
          Not Found
        </Box>
      )}
      {showImage && (
        <Dialog
          open={showImage}
          onClose={() => setShowImage(false)}
          PaperProps={{ sx: { bgcolor: "background.default" } }}
        >
          <DialogTitle align="center">
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
                  width={275}
                  height={400}
                  sizes="(max-width: 900px) 100vw, 275px"
                  style={{ width: "100%", height: "auto" }}
                  alt="Not Found"
                  placeholder="blur"
                  blurDataURL="/spin.svg"
                  className="rounded"
                />
                {movie.dani_approved && (
                  <DaniBadge
                    size={100}
                    right={{ xs: 32, md: 0 }}
                    onClick={() => setShowImage(true)}
                  />
                )}
              </Box>
              <Box className="w-full flex items-center justify-center">
                <ScoreCard
                  label="Ranking:"
                  value={movie.ranking}
                  total={getTotalCount.data}
                  score={movie.jh_score}
                />
              </Box>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 5 }}>
              <Stack spacing={2}>
                <InfoTable movie={movie} />
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
