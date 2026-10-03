import Filters from "@/components/filters";
import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import ErrorMessage from "@/components/errorMessage";
import { useGetRandomMovie, useMovieCount, useTypesList } from "@/api/hooks";
import { Box, Button, Grid2, Link, Stack } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import DaniBadge from "@/components/daniBadge";
import ScoreCard from "@/components/scoreCard";

export const RandomMovie = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [params, setParams] = useState<MovieListQuery>({});
  const [roll, setRoll] = useState(0);

  const getRandomMovie = useGetRandomMovie(params, roll);

  const typesList = useTypesList();

  const getTotalCount = useMovieCount();

  const randomMovie = showFilters ? undefined : getRandomMovie.data;

  const filterTypes = typesList.data;

  const onNext = () => {
    setRoll((previous) => previous + 1);
  };

  const onFilterApply = (filterValues: MovieListQuery) => {
    setParams(filterValues);
    // Re-roll even when the filters didn't change, matching the old behavior
    // where Apply always fetched a fresh movie.
    setRoll((previous) => previous + 1);
    setShowFilters(false);
  };

  const onReturnToFilters = () => {
    setShowFilters(true);
  };

  return (
    <Layout pageTitle="Random Movie" holiday={randomMovie?.holiday}>
      {typesList.isError ? (
        <ErrorMessage
          message="Couldn't load the filters."
          onRetry={() => typesList.refetch()}
        />
      ) : getRandomMovie.isFetching || !filterTypes ? (
        <Spinner />
      ) : getRandomMovie.isError && !showFilters ? (
        <ErrorMessage message="Couldn't load a movie." onRetry={onNext} />
      ) : randomMovie ? (
        <Stack spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 6 }} className="mb-2 px-2 text-right">
              <Button
                sx={{
                  width: "50%",
                  borderRadius: "0.5rem",
                  color: "secondary.main",
                  outline: "1px solid",
                  height: "100%",
                }}
                onClick={onNext}
              >
                Next
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 6 }} className="mb-2 px-2">
              <Button
                sx={{
                  width: "50%",
                  borderRadius: "0.5rem",
                  color: "secondary.main",
                  outline: "1px solid",
                }}
                onClick={onReturnToFilters}
              >
                Return to Filters
              </Button>
            </Grid2>
          </Grid2>
          <Link href={`/movie/${randomMovie.tmdbid}`}>
            <Box
              sx={{
                px: { xs: "2rem", md: "0rem" },
                position: "relative",
                display: "flex",
                justifyContent: "center",
                maxHeight: "60vh",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: "60vh",
                  width: "auto",
                }}
              >
                <Image
                  src={randomMovie.poster.replace("w500", "w780")}
                  alt={randomMovie.movie}
                  placeholder="blur"
                  blurDataURL="/spin.svg"
                  width={300}
                  height={450}
                  style={{
                    maxHeight: "60vh",
                    height: "100%",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  className="rounded"
                />
                {randomMovie.dani_approved && <DaniBadge size={64} />}
              </Box>
            </Box>
          </Link>
          <Grid2 container spacing={2} sx={{ justifyContent: "center" }}>
            <ScoreCard
              label="Ranking:"
              value={randomMovie.ranking}
              total={getTotalCount.data}
              score={randomMovie.jh_score}
            />
            <ScoreCard
              label="Score:"
              value={randomMovie.jh_score}
              total={100}
              score={randomMovie.jh_score}
            />
          </Grid2>
        </Stack>
      ) : (
        filterTypes && (
          <Filters
            filterTypes={filterTypes}
            onApply={onFilterApply}
            onClear={() => {}}
            values={params}
            showScore
          />
        )
      )}
    </Layout>
  );
};

export default RandomMovie;
