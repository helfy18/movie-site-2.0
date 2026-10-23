import Filters from "@/components/filters";
import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import ErrorMessage from "@/components/errorMessage";
import PosterDeck from "@/components/posterDeck";
import { useMovieCount, useRandomDeck, useTypesList } from "@/api/hooks";
import { scoreColor } from "@/styles/gradient";
import { gridLink } from "@/utils";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const DECK_SIZE = 3;

const activeFilterCount = (params: MovieListQuery) =>
  Object.values(params).filter((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value),
  ).length;

const genresOf = (movie: Movie) =>
  [movie.genre, movie.genre_2, movie.genre_3].filter(Boolean) as string[];

const RandomMovie = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [params, setParams] = useState<MovieListQuery>({});
  const [roll, setRoll] = useState(0);

  const typesList = useTypesList();
  const totalCount = useMovieCount();
  const deck = useRandomDeck(params, roll, DECK_SIZE);
  const front = deck[0];
  const movie = front.data;

  const onDeal = () => setRoll((previous) => previous + 1);

  const onFilterApply = (filterValues: MovieListQuery) => {
    setParams(filterValues);
    setRoll((previous) => previous + 1);
    setShowFilters(false);
  };

  const filterCount = activeFilterCount(params);
  const summary =
    filterCount > 0
      ? `Drawing from movies matching ${filterCount} filter${
          filterCount === 1 ? "" : "s"
        }`
      : `Drawing from all ${totalCount.data?.toLocaleString() ?? ""} rated movies`;

  if (typesList.isError) {
    return (
      <Layout pageTitle="Random Movie">
        <ErrorMessage
          message="Couldn't load the filters."
          onRetry={() => typesList.refetch()}
        />
      </Layout>
    );
  }
  if (!typesList.data) {
    return (
      <Layout pageTitle="Random Movie">
        <Spinner />
      </Layout>
    );
  }

  if (showFilters) {
    return (
      <Layout pageTitle="Random Movie">
        <Box className="max-w-3xl mx-auto">
          <Box className="flex justify-between items-baseline mb-2">
            <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
              Filters
            </Typography>
            <Button
              color="secondary"
              sx={{ textTransform: "none", fontWeight: 600 }}
              onClick={() => setShowFilters(false)}
            >
              Cancel
            </Button>
          </Box>
          <Filters
            filterTypes={typesList.data}
            onApply={onFilterApply}
            onClear={() => onFilterApply({})}
            values={params}
            showScore
          />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Random Movie" holiday={movie?.holiday}>
      <Box className="max-w-3xl mx-auto">
        <Box className="flex justify-between items-baseline">
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: "bold", color: "text.secondary" }}
          >
            Random movie
          </Typography>
          <Button
            color="secondary"
            sx={{ textTransform: "none", fontWeight: 600 }}
            onClick={() => setShowFilters(true)}
          >
            Filters
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "text.disabled", mb: 2, minHeight: "1.5em" }}
        >
          {summary}
        </Typography>
        {front.isError ? (
          <ErrorMessage message="Couldn't load a movie." onRetry={onDeal} />
        ) : (
          <Stack spacing={2} sx={{ alignItems: "center", pt: 1 }}>
            <PosterDeck
              movies={deck.map((card) => card.data)}
              onDeal={onDeal}
            />
            <Box sx={{ textAlign: "center", minHeight: 150, width: "100%" }}>
              {movie && (
                <>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    {movie.movie}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                    {[
                      movie.year,
                      movie.rated,
                      movie.runtime && `${movie.runtime} min`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Typography>
                  <Box className="flex justify-center flex-wrap gap-1.5 mt-2">
                    {genresOf(movie).map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        component={Link}
                        href={gridLink({ genre: [genre] })}
                        variant="outlined"
                        color="secondary"
                        size="small"
                        clickable
                      />
                    ))}
                  </Box>
                  <Typography
                    sx={{
                      mt: 1.5,
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: scoreColor(movie.jh_score),
                    }}
                  >
                    {movie.jh_score}/100
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.disabled", fontWeight: 600 }}
                  >
                    #{movie.ranking} of {totalCount.data?.toLocaleString()}
                  </Typography>
                </>
              )}
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={onDeal}
              disabled={!movie}
              sx={{
                width: "100%",
                maxWidth: 360,
                py: 1.5,
                borderRadius: "14px",
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "none",
              }}
            >
              Deal me another
            </Button>
            <Box className="flex gap-5 text-sm">
              {movie && (
                <Link
                  href={`/movie/${movie.tmdbid}`}
                  prefetch={false}
                  className="font-semibold"
                >
                  See full page →
                </Link>
              )}
              <Typography
                variant="body2"
                sx={{
                  color: "text.disabled",
                  display: "none",
                  "@media (pointer: coarse)": { display: "block" },
                }}
              >
                or swipe the card
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
    </Layout>
  );
};

export default RandomMovie;
