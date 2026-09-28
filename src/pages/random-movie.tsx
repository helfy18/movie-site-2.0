import Filters from "@/components/filters";
import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import {
  useGetRandomMovie,
  useMovieCount,
  useTypesList,
} from "@/contexts/apiContext";
import { Box, Button, Grid2, Link, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import DaniBadge from "@/components/daniBadge";
import ScoreCard from "@/components/scoreCard";

export const RandomMovie = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [params, setParams] = useState<MovieListQuery>({});

  const getRandomMovie = useGetRandomMovie(params, {
    enabled: false,
  });

  const typesList = useTypesList();

  const getTotalCount = useMovieCount();

  const randomMovie = showFilters ? undefined : getRandomMovie.data;

  const filterTypes = useMemo<AllType | undefined>(
    () => typesList.data && { ...typesList.data, score: [0, 100] },
    [typesList.data],
  );

  const { refetch: fetchRandomMovie } = getRandomMovie;

  useEffect(() => {
    fetchRandomMovie();
  }, [params, fetchRandomMovie]);

  const onFilterApply = (filterValues: MovieListQuery) => {
    setParams(filterValues);
    setShowFilters(false);
  };

  const onNext = () => {
    getRandomMovie.refetch();
  };

  const onReturnToFilters = () => {
    setShowFilters(true);
  };

  return (
    <Layout pageTitle="Random Movie" holiday={randomMovie?.holiday}>
      {getRandomMovie.isFetching || !filterTypes ? (
        <Spinner />
      ) : randomMovie ? (
        <Stack spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 6 }} key={1} className="mb-2 px-2 text-right">
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
            <Grid2 size={{ xs: 6 }} key={2} className="mb-2 px-2">
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
          <Link href={`/movie-page?id=${randomMovie.tmdbid}`}>
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
                  src={randomMovie.poster.replace("w500", "original")}
                  alt="Not Found"
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
          ></Filters>
        )
      )}
    </Layout>
  );
};

export default RandomMovie;
