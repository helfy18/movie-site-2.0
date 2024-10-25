/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import MovieGrid from "@/components/movieGrid";
import Filters from "@/components/filters";
import {
  Slider,
  Grid,
  Select,
  Stack,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMoviesList, useTypesList } from "@/contexts/apiContext";

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

// function selectedOptions(data: any, toAdd: any, label: any) {
//   if (data) {
//     data = data.filter((entry: any) => entry["category"] !== label);
//   }
//   return data ? data.concat(toAdd) : toAdd;
// }

const MoviePage = () => {
  //   const handleChange = (event, newValue) => {
  //     setSliderValue(newValue);
  //   };

  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const [params, setParams] = useState<MovieListQuery>({});
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

  useEffect(() => {
    console.log(
      `Success:${listMovies.isSuccess} Loading:${listMovies.isError}`
    );
  }, [listMovies]);

  return (
    <Layout pageTitle="Movies">
      <Stack direction="row" className="justify-center">
        <Grid className="text-center mx-2 my-4">
          <TextField
            placeholder="Search for Title, Actor, Director..."
            onChange={(event) => {
              setDisplayMovies(movieSearch(event.target.value, allMovies));
            }}
            color="secondary"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-yellow-500" />
                </InputAdornment>
              ),
              style: {
                color: "#eab308",
              },
            }}
          />
        </Grid>
        <Grid>
          <Button
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
            className="px-20 py-4 mx-2 my-4 text-yellow-500 outline-1 outline align-center"
          >
            {showDropdown ? "Hide" : "Filters"} &#8597;
          </Button>
        </Grid>
      </Stack>
      {showDropdown ? (
        <Grid container className="mb-4 pt-2 bg-stone-700">
          <Grid xs={6} item key={1} className="mb-2 px-2 text-right">
            <Button
              className="w-1/2 rounded-lg text-yellow-500 outline-1 outline"
              onClick={() => {
                setShowDropdown(!showDropdown);
                // apply the filters
              }}
            >
              Apply
            </Button>
          </Grid>
          <Grid xs={6} item key={2} className="mb-2 px-2">
            <Button
              className="w-1/2 rounded-lg text-yellow-500 outline-1 outline"
              onClick={() => {
                setParams({});
                setDisplayMovies([]);
                listMovies.refetch();
                setShowDropdown(!showDropdown);
              }}
            >
              Reset
            </Button>
          </Grid>
          {filterTypes && <Filters filterTypes={filterTypes}></Filters>}
        </Grid>
      ) : null}
      <Stack direction="row">
        {listMovies.isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
            width="100%"
          >
            <CircularProgress color="secondary" />
          </Box>
        )}
        {displayMovies && <MovieGrid movies={displayMovies} />}
      </Stack>
    </Layout>
  );
};

export default MoviePage;
