import Layout from "@/components/layout";
import { useMovieCount, useMovieGet } from "@/api/hooks";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import TitleBlock from "@/components/titleBlock";
import CastList from "@/components/castList";
import WhereToWatch from "@/components/whereToWatch";
import CriticBars from "@/components/criticBars";
import DetailsCard from "@/components/detailsCard";
import PosterRow from "@/components/posterRow";
import { castNames, jsonLdScript } from "@/utils";

export interface MovieDetailProps {
  movie: Movie;
  // Poster-row fields only: the full Movie objects were 90% of each page.
  recommended: PosterMovie[];
  totalCount: number;
}

// A short plot leaves room for an extra row of cast in the middle column.
const SHORT_PLOT_CHARS = 200;

const MovieDetail = ({
  movie: initialMovie,
  recommended,
  totalCount,
}: MovieDetailProps) => {
  const [showImage, setShowImage] = useState(false);

  const movie =
    useMovieGet(
      { tmdbid: initialMovie.tmdbid },
      { initialData: initialMovie, enabled: initialMovie.jh_score !== -1 },
    ).data ?? initialMovie;
  const reviewed = movie.jh_score !== -1;
  const count = useMovieCount({ initialData: totalCount }).data;
  const cast = movie.cast ?? [];
  const castShown = movie.plot.length <= SHORT_PLOT_CHARS ? 12 : 10;

  const sectionHeading = {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "secondary.main",
    mb: 1.5,
  };

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

      <TitleBlock
        movie={movie}
        totalCount={count}
        onDaniClick={() => setShowImage(true)}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "240px minmax(0, 1fr)",
            lg: "300px minmax(0, 1fr) 340px",
          },
          gap: 3.25,
          py: 3,
        }}
      >
        {movie.poster && (
          <Box sx={{ maxWidth: { xs: 220, md: "none" }, mx: "auto" }}>
            <Image
              src={movie.poster.replace("w500", "w780")}
              width={300}
              height={450}
              sizes="(max-width: 900px) 220px, 300px"
              style={{ width: "100%", height: "auto" }}
              alt={`${movie.movie} poster`}
              className="rounded-lg"
              priority
            />
          </Box>
        )}
        <Stack spacing={2}>
          {movie.plot && (
            <Typography sx={{ color: "text.secondary", maxWidth: "62ch" }}>
              {movie.plot}
            </Typography>
          )}
          <CastList cast={cast} shown={castShown} />
        </Stack>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridColumn: { md: "1 / -1", lg: "auto" },
            gridTemplateColumns: { md: "1fr 1fr", lg: "1fr" },
            alignItems: "start",
          }}
        >
          {movie.trailer && (
            <Box
              sx={{
                gridRow: { md: "1 / span 2", lg: "auto" },
                aspectRatio: "16 / 9",
                borderRadius: "10px",
                overflow: "hidden",
                bgcolor: "#000",
              }}
            >
              <iframe
                src={movie.trailer}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Trailer"
                className="w-full h-full"
              />
            </Box>
          )}
          <CriticBars movie={movie} />
          <WhereToWatch movie={movie} />
        </Box>
      </Box>

      {movie.review && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 240px" },
            gap: 4,
            alignItems: "start",
            pt: 3.5,
            pb: 1,
            borderTop: "1px solid",
            borderColor: "background.paper",
          }}
        >
          <Box>
            <Typography component="h2" sx={sectionHeading}>
              Johnathan&apos;s review
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                maxWidth: "72ch",
                fontSize: "1.0625rem",
                lineHeight: 1.65,
                whiteSpace: "pre-line",
              }}
            >
              {movie.review}
            </Typography>
          </Box>
          <DetailsCard movie={movie} totalCount={count} />
        </Box>
      )}
      {!movie.review && (
        <Box sx={{ maxWidth: 360, pt: 3 }}>
          <DetailsCard movie={movie} totalCount={count} />
        </Box>
      )}

      {recommended.length > 0 && (
        <Box sx={{ pt: 3 }}>
          <PosterRow title="More Like This" movies={recommended} />
        </Box>
      )}
    </Layout>
  );
};

export default MovieDetail;
