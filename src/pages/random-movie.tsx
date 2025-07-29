import Filters from "@/components/filters";
import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import {
  useGetRandomMovie,
  useMovieCount,
  useTypesList,
} from "@/contexts/apiContext";
import { Box, Button, Grid2, Link, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Item } from "./movie-page";
import Image from "next/image";
import { gradient } from "@/components/movieGrid";

export const RandomMovie = () => {
  const [randomMovie, setRandomMovie] = useState<Movie | undefined>();
  const [params, setParams] = useState<MovieListQuery>({});
  const [filterTypes, setFilterTypes] = useState<AllType>();

  const getRandomMovie = useGetRandomMovie(params, {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const typesList = useTypesList({
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const getTotalCount = useMovieCount({ refetchOnWindowFocus: false });

  useEffect(() => {
    if (getRandomMovie.isSuccess) {
      console.log(getRandomMovie.data);
      setRandomMovie(getRandomMovie.data);
    } else if (getRandomMovie.isError) {
      console.log(getRandomMovie.error);
    }
  }, [getRandomMovie.isFetching]);

  useEffect(() => {
    if (typesList.isSuccess) {
      let filterType = typesList.data;
      filterType.score = [0, 100];
      setFilterTypes(filterType);
    } else if (typesList.isError) {
      console.log(typesList.error);
    }
  }, [typesList.isFetching]);

  useEffect(() => {
    getRandomMovie.refetch();
  }, [JSON.stringify(params)]);

  const onFilterApply = (filterValues: MovieListQuery) => {
    setParams(filterValues);
  };

  const onNext = () => {
    getRandomMovie.refetch();
  };

  const OnReturnToFilters = () => {
    setRandomMovie(undefined);
  };

  return (
    <Layout pageTitle={`Random Movie`}>
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
                onClick={OnReturnToFilters}
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
                {randomMovie.dani_approved && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 64,
                      height: 64,
                    }}
                  >
                    <Tooltip title="Dani Approved" arrow>
                      <Image
                        src="/dani.png"
                        alt="Verified"
                        width={64}
                        height={64}
                        style={{ cursor: "pointer", objectFit: "contain" }}
                      />
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </Box>
          </Link>
          <Grid2 container spacing={2} sx={{ justifyContent: "center" }}>
            <Item
              sx={{
                textAlign: "center",
                color: "secondary.main",
                display: "flex",
                flexDirection: "column",
                fontSize: "1.3em",
                width: "fit-content",
                fontWeight: "bold",
                height: "fit-content",
              }}
            >
              Ranking:
              <Box
                style={{
                  color: gradient[randomMovie.jh_score],
                }}
              >
                {randomMovie.ranking}
              </Box>
              <Box className="relative">
                <hr
                  className="absolute top-1/2 w-full"
                  style={{
                    borderColor: gradient[randomMovie.jh_score],
                  }}
                />
              </Box>
              <Box
                style={{
                  color: gradient[randomMovie.jh_score],
                }}
              >
                {getTotalCount.data}
              </Box>
            </Item>
            <Item
              sx={{
                textAlign: "center",
                color: "secondary.main",
                display: "flex",
                flexDirection: "column",
                fontSize: "1.3em",
                width: "fit-content",
                fontWeight: "bold",
                height: "fit-content",
              }}
            >
              Score:
              <Box
                style={{
                  color: gradient[randomMovie.jh_score],
                }}
              >
                {randomMovie.jh_score}
              </Box>
              <Box className="relative">
                <hr
                  className="absolute top-1/2 w-full"
                  style={{
                    borderColor: gradient[randomMovie.jh_score],
                  }}
                />
              </Box>
              <Box
                style={{
                  color: gradient[randomMovie.jh_score],
                }}
              >
                100
              </Box>
            </Item>
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
