import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import Layout from "@/components/layout";
import MovieGrid from "@/components/movieGrid";
import Filters from "@/components/filters";
import {
  Box,
  Button,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMoviesListCompact, useTypesList } from "@/api/hooks";
import Spinner from "@/components/spinner";
import ErrorMessage from "@/components/errorMessage";
import { useRouter } from "next/router";
import Link from "next/link";
import { movieSearch, parseGridQuery, personLink, personSearch } from "@/utils";

const SEARCH_DEBOUNCE_MS = 300;

const gridUrl = (filters: MovieListQuery, search: string, page = 1) => ({
  pathname: "/movie-grid",
  query: {
    ...filters,
    ...(search ? { search } : {}),
    ...(page > 1 ? { page } : {}),
  },
});

const MovieGridPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const params = useMemo(() => parseGridQuery(router.query), [router.query]);
  const urlSearch =
    typeof router.query.search === "string" ? router.query.search : "";
  const urlPage = Number(
    typeof router.query.page === "string" ? router.query.page : NaN,
  );
  const currentPage = Number.isInteger(urlPage) && urlPage > 0 ? urlPage : 1;

  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch);
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  const listMovies = useMoviesListCompact(params, {
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

  const peopleMatches = useMemo(
    () => (searchTerm ? personSearch(searchTerm, allMovies) : []),
    [searchTerm, allMovies],
  );

  const onPageChange = (page: number) => {
    clearTimeout(debounceTimer.current);
    router.replace(gridUrl(params, searchTerm, page), undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const onSearch = (text: string) => {
    setSearchTerm(text);
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
          showScore
        ></Filters>
      )}
      {peopleMatches.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            justifyContent: "center",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Box component="span" sx={{ mr: 1 }}>
            People:
          </Box>
          {peopleMatches.map((person) => (
            <Chip
              key={person.name}
              label={person.name}
              component={Link}
              href={personLink(person.name)}
              variant="outlined"
              color="secondary"
              clickable
            />
          ))}
        </Box>
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
            onPageChange={onPageChange}
          />
        )}
      </Stack>
    </Layout>
  );
};

export default MovieGridPage;
