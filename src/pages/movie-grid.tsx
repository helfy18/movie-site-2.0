import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import Layout from "@/components/layout";
import MovieGrid from "@/components/movieGrid";
import Filters from "@/components/filters";
import { Stack, Button, TextField, InputAdornment, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMoviesList, useTypesList } from "@/api/hooks";
import Spinner from "@/components/spinner";
import ErrorMessage from "@/components/errorMessage";
import { useRouter } from "next/router";
import { parseGridQuery } from "@/utils";

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

const SEARCH_DEBOUNCE_MS = 300;

const gridUrl = (filters: MovieListQuery, search: string) => ({
  pathname: "/movie-grid",
  query: { ...filters, ...(search ? { search } : {}) },
});

const MovieGridPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const params = useMemo(() => parseGridQuery(router.query), [router.query]);
  const urlSearch =
    typeof router.query.search === "string" ? router.query.search : "";

  // Reset pagination whenever the query changes, including back/forward
  // navigation. Adjusting state during render (instead of in an effect)
  // resets the page before paint: https://react.dev/learn/you-might-not-need-an-effect
  const [prevParams, setPrevParams] = useState(params);
  if (prevParams !== params) {
    setPrevParams(params);
    setCurrentPage(1);
  }

  // Adopt search terms that arrive via the URL (deep links, back/forward).
  // Our own debounced writes land with urlSearch === searchTerm and are
  // skipped.
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch);
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      setCurrentPage(1);
    }
  }

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(debounceTimer.current), []);

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
    // Mirror the term into the URL (debounced, replace) so searches are
    // shareable without filling the browser history while typing.
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      router.replace(gridUrl(params, text), undefined, {
        shallow: true,
        scroll: false,
      });
    }, SEARCH_DEBOUNCE_MS);
  };

  const onFilterApply = (filterValues: MovieListQuery) => {
    clearTimeout(debounceTimer.current);
    router.push(gridUrl(filterValues, searchTerm), undefined, {
      shallow: true,
    });
    setShowDropdown(false);
  };

  const onFilterClear = () => {
    clearTimeout(debounceTimer.current);
    router.push(gridUrl({}, searchTerm), undefined, { shallow: true });
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
