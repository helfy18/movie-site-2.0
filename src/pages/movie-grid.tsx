import * as React from "react";
import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import MovieGrid from "@/components/movieGrid";
import Filters from "@/components/filters";
import { Stack, Button, TextField, InputAdornment, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMoviesList, useTypesList } from "@/api/hooks";
import Spinner from "@/components/spinner";
import ErrorMessage from "@/components/errorMessage";
import { useRouter } from "next/router";
import { gridLink, parseGridQuery } from "@/utils";

const movieSearch = (text: string, movies: Movie[]) => {
  const lowerText = text.toLowerCase();
  const keys: (keyof Movie)[] = [
    "movie",
    "actors",
    "director",
    "universe",
    "sub_universe",
    "studio",
  ];

  return movies.filter((movie) =>
    keys.some((key) =>
      movie[key]?.toString().toLowerCase().includes(lowerText),
    ),
  );
};

const MovieGridPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const params = useMemo(() => parseGridQuery(router.query), [router.query]);

  // Reset pagination whenever the query changes, including back/forward
  // navigation. Adjusting state during render (instead of in an effect)
  // resets the page before paint: https://react.dev/learn/you-might-not-need-an-effect
  const [prevParams, setPrevParams] = useState(params);
  if (prevParams !== params) {
    setPrevParams(params);
    setCurrentPage(1);
  }

  const listMovies = useMoviesList(params, {
    enabled: router.isReady,
  });

  const allMovies = useMemo(
    () => [...(listMovies.data ?? [])].sort((a, b) => b.jh_score - a.jh_score),
    [listMovies.data],
  );

  const typesList = useTypesList();
  const filterTypes = typesList.data;

  const displayMovies = useMemo(
    () => movieSearch(searchTerm, allMovies),
    [searchTerm, allMovies],
  );

  const onSearch = (text: string) => {
    setSearchTerm(text);
    setCurrentPage(1);
  };

  const onFilterApply = (filterValues: MovieListQuery) => {
    router.push(gridLink(filterValues), undefined, { shallow: true });
    setShowDropdown(false);
  };

  const onFilterClear = () => {
    router.push(gridLink({}), undefined, { shallow: true });
    setShowDropdown(false);
  };

  return (
    <Layout pageTitle="Movie Grid">
      <Grid container>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            textAlign: { xs: "center", md: "right" },
            marginY: "0.5rem",
          }}
        >
          <TextField
            placeholder="Search for Title, Actor, Director..."
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            color="secondary"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="secondary" />
                  </InputAdornment>
                ),
              },
            }}
            className="mx-2"
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            textAlign: { xs: "center", md: "left" },
            marginY: "0.5rem",
          }}
        >
          <Button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={!filterTypes}
            sx={{
              px: 10,
              py: 2,
              mx: 1,
              color: "secondary.main",
              outline: "1px solid",
            }}
          >
            {showDropdown ? "Hide" : "Filters"} &#8597;
          </Button>
          {typesList.isError && (
            <span className="text-muted">Filters unavailable</span>
          )}
        </Grid>
      </Grid>
      {showDropdown && filterTypes && (
        <Filters
          filterTypes={filterTypes}
          onApply={onFilterApply}
          onClear={onFilterClear}
          values={params}
        ></Filters>
      )}
      <Stack direction="row">
        {listMovies.isPending && <Spinner />}
        {listMovies.isError ? (
          <ErrorMessage
            message="Couldn't load the movie list."
            onRetry={() => listMovies.refetch()}
          />
        ) : (
          <MovieGrid
            movies={displayMovies}
            page={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Stack>
    </Layout>
  );
};

export default MovieGridPage;
