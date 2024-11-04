/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import MovieGrid from "@/components/movieGrid";
import Filters from "@/components/filters";
import { Stack, Button, TextField, InputAdornment, Grid2 } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  useMoviesList,
  useTypesList,
  activeFilter,
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
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const [params, setParams] = useState<MovieListQuery>(activeFilter);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterTypes, setFilterTypes] = useState<AllType>();

  const listMovies = useMoviesList(params, {
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (listMovies.isSuccess) {
      const sortedMovies: Movie[] = listMovies.data.sort(
        (a, b) => b.jh_score - a.jh_score
      );
      setAllMovies(sortedMovies);
      setDisplayMovies(sortedMovies);
    } else if (listMovies.isError) {
      console.log(listMovies.error);
    }
  }, [listMovies.isFetching]);

  const typesList = useTypesList({
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (typesList.isSuccess) {
      setFilterTypes(typesList.data);
    } else if (typesList.isError) {
      console.log(typesList.error);
    }
  }, [typesList.isFetching]);

  const onFilterApply = (filterValues: MovieListQuery) => {
    if (params !== filterValues) setDisplayMovies([]);
    setParams(filterValues);
    setShowDropdown(!showDropdown);
  };

  const onFilterClear = () => {
    setDisplayMovies([]);
    listMovies.refetch();
    setParams({});
    setShowDropdown(!showDropdown);
  };

  return (
    <Layout pageTitle="Movies">
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
            onChange={(event) => {
              setDisplayMovies(movieSearch(event.target.value, allMovies));
            }}
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
        {displayMovies && <MovieGrid movies={displayMovies} />}
      </Stack>
    </Layout>
  );
};

export default MovieGridPage;
