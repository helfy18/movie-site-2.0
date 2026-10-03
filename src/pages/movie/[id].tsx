import Layout from "@/components/layout";
import {
  fetchMovie,
  fetchMovieCount,
  fetchMoviesById,
  hasServerResponse,
} from "@/api/client";
import { useMovieCount, useMovieGet, useMovieListById } from "@/api/hooks";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import InfoTable from "@/components/infoTable";
import { Item } from "@/components/item";
import DaniBadge from "@/components/daniBadge";
import ScoreCard from "@/components/scoreCard";
import ProviderTable from "@/components/providerTable";
import OtherSiteReviews from "@/components/otherSiteReviews";
import PosterRow from "@/components/posterRow";

interface Props {
  movie: Movie;
  recommended: Movie[];
  totalCount: number;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, { id: string }> = async ({
  params,
}) => {
  const id = Number(params?.id);
  if (!Number.isInteger(id) || id <= 0) return { notFound: true };

  let movie: Movie;
  try {
    movie = await fetchMovie({ tmdbid: id });
  } catch (error) {
    if (hasServerResponse(error)) return { notFound: true, revalidate: 60 };
    throw error;
  }

  const [recommended, totalCount] = await Promise.all([
    movie.recommendations.length > 0
      ? fetchMoviesById({ tmdbid: movie.recommendations })
      : [],
    fetchMovieCount(),
  ]);

  return { props: { movie, recommended, totalCount }, revalidate: 3600 };
};

const MoviePage = ({
  movie: initialMovie,
  recommended: initialRecommended,
  totalCount,
}: Props) => {
  const [showImage, setShowImage] = useState(false);

  const movie =
    useMovieGet({ tmdbid: initialMovie.tmdbid }, { initialData: initialMovie })
      .data ?? initialMovie;
  const recommended =
    useMovieListById(
      { tmdbid: movie.recommendations },
      { initialData: initialRecommended },
    ).data ?? [];
  const count = useMovieCount({ initialData: totalCount }).data;

  return (
    <Layout pageTitle={movie.movie} holiday={movie.holiday}>
      <Head>
        <meta name="description" content={movie.plot} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={movie.movie} />
        <meta property="og:description" content={movie.plot} />
        <meta property="og:image" content={movie.poster} />
      </Head>
      <Dialog
        open={showImage}
        onClose={() => setShowImage(false)}
        slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}
      >
        <DialogTitle align="center">Dani Approved</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ alignItems: "center" }}>
            <Image src="/dani.png" alt="verified" width="300" height="300" />
            <Typography variant="body2" sx={{ color: "secondary.main" }}>
              Drawing Credit: Phoebe Torres
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
      <Grid container className="flex flex-wrap" spacing={2.5}>
        <Grid
          size={{ xs: 12, md: 2.8 }}
          sx={{ textAlign: "center" }}
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
              src={movie.poster.replace("w500", "w780")}
              width={275}
              height={400}
              sizes="(max-width: 900px) 100vw, 275px"
              style={{ width: "100%", height: "auto" }}
              alt={movie.movie}
              placeholder="blur"
              blurDataURL="/spin.svg"
              className="rounded"
              priority
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
              total={count}
              score={movie.jh_score}
            />
          </Box>
        </Grid>
        <Grid size={{ sm: 12, md: 5 }}>
          <Stack spacing={2}>
            <InfoTable movie={movie} />
            <ProviderTable movie={movie} />
          </Stack>
        </Grid>
        <Grid size={{ sm: 12, md: 4.2 }}>
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
            <Item sx={{ color: "secondary.main" }}>
              Plot:
              <br />
              {movie.plot}
            </Item>
            {movie.review && (
              <Item sx={{ color: "secondary.main" }}>
                Review:
                <br />
                {movie.review}
              </Item>
            )}
            <OtherSiteReviews movie={movie} />
          </Stack>
        </Grid>
      </Grid>
      {recommended.length > 0 && (
        <PosterRow title="More Like This" movies={recommended} />
      )}
    </Layout>
  );
};

export default MoviePage;
