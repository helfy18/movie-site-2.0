import Layout from "@/components/layout";
import { useMovieCount, useMovieGet } from "@/api/hooks";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
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
import CastSection from "@/components/castSection";
import { castNames, jsonLdScript } from "@/utils";

export interface MovieDetailProps {
  movie: Movie;
  // Poster-row fields only: the full Movie objects were 90% of each page.
  recommended: PosterMovie[];
  totalCount: number;
}

const MovieDetail = ({
  movie: initialMovie,
  recommended: initialRecommended,
  totalCount,
}: MovieDetailProps) => {
  const [showImage, setShowImage] = useState(false);

  const movie =
    useMovieGet(
      { tmdbid: initialMovie.tmdbid },
      { initialData: initialMovie, enabled: initialMovie.jh_score !== -1 },
    ).data ?? initialMovie;
  const reviewed = movie.jh_score !== -1;
  const recommended = initialRecommended;
  const count = useMovieCount({ initialData: totalCount }).data;
  const cast = movie.cast ?? [];

  return (
    <Layout pageTitle={movie.movie} holiday={movie.holiday}>
      <Head>
        {!reviewed && <meta name="robots" content="noindex" />}
        <meta name="description" content={movie.plot} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={movie.movie} />
        <meta property="og:description" content={movie.plot} />
        <meta property="og:image" content={movie.poster} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript({
              "@context": "https://schema.org",
              "@type": "Movie",
              name: movie.movie,
              image: movie.poster,
              description: movie.plot,
              datePublished: String(movie.year),
              director: (movie.directors ?? []).map((name) => ({
                "@type": "Person",
                name,
              })),
              actor: castNames(movie)
                .slice(0, 10)
                .map((name) => ({
                  "@type": "Person",
                  name,
                })),
              ...(reviewed
                ? {
                    review: {
                      "@type": "Review",
                      author: { "@type": "Person", name: "Johnathan" },
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: movie.jh_score,
                        bestRating: 100,
                        worstRating: 0,
                      },
                      ...(movie.review ? { reviewBody: movie.review } : {}),
                    },
                  }
                : {}),
            }),
          }}
        />
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
            {movie.poster && (
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
            )}
            {movie.dani_approved && (
              <DaniBadge
                size={100}
                right={{ xs: 32, md: 0 }}
                onClick={() => setShowImage(true)}
              />
            )}
          </Box>
          <Box className="w-full flex items-center justify-center">
            {reviewed ? (
              <ScoreCard
                label="Ranking:"
                value={movie.ranking}
                total={count}
                score={movie.jh_score}
              />
            ) : (
              <Item
                sx={{
                  color: "secondary.main",
                  fontSize: "1.3em",
                  fontWeight: "bold",
                  width: "fit-content",
                }}
              >
                Not Yet Reviewed
              </Item>
            )}
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
      {cast.length > 0 && <CastSection cast={cast} />}
      {recommended.length > 0 && (
        <PosterRow title="More Like This" movies={recommended} />
      )}
    </Layout>
  );
};

export default MovieDetail;
