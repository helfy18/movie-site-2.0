import * as React from "react";
import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import MovieGrid from "@/components/movieGrid";
import Filters from "@/components/filters";
import { Stack, Button, TextField, InputAdornment, Grid2 } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  useApiContext,
  useMoviesList,
  useTypesList,
} from "@/contexts/apiContext";
import Spinner from "@/components/spinner";

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
    keys.some((key) => movie[key]?.toString().toLowerCase().includes(lowerText))
  );
};

const MovieGridPage = () => {
  const { filters } = useApiContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState<MovieListQuery>(filters);
  const [showDropdown, setShowDropdown] = useState(false);

  const listMovies = useMoviesList(params, {
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const allMovies = useMemo(
    () => [...(listMovies.data ?? [])].sort((a, b) => b.jh_score - a.jh_score),
    [listMovies.data],
  );

  const typesList = useTypesList({
    enabled: true,
    refetchOnWindowFocus: false,
  });
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
    setParams(filterValues);
    setCurrentPage(1);
    setShowDropdown(!showDropdown);
  };

  const onFilterClear = () => {
    listMovies.refetch();
    setParams({});
    setCurrentPage(1);
    setShowDropdown(!showDropdown);
  };

  return (
    <Layout pageTitle="Movie Grid">
      <Grid2 container>
        <Grid2
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
                    <SearchIcon className="text-yellow-500" />
                  </InputAdornment>
                ),
                style: {
                  color: "#eab308",
                },
              },
            }}
            className="mx-2"
          />
        </Grid2>
        <Grid2
          size={{ xs: 12, md: 6 }}
          sx={{
            textAlign: { xs: "center", md: "left" },
            marginY: "0.5rem",
          }}
        >
          <Button
            onClick={() => setShowDropdown(!showDropdown)}
            sx={{
              px: 10,
              py: 2,
              mx: 1,
              color: "#EAB308",
              outline: "1px solid",
            }}
          >
            {showDropdown ? "Hide" : "Filters"} &#8597;
          </Button>
        </Grid2>
      </Grid2>
      {showDropdown && filterTypes && (
        <Filters
          filterTypes={filterTypes}
          onApply={onFilterApply}
          onClear={onFilterClear}
          values={params}
        ></Filters>
      )}
      <Stack direction="row">
        {listMovies.isLoading && <Spinner />}
        <MovieGrid
          movies={displayMovies}
          page={currentPage}
          onPageChange={setCurrentPage}
        />
      </Stack>
    </Layout>
  );
};

export default MovieGridPage;
