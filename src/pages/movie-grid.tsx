import * as React from "react";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import MovieGrid from "@/components/movieGrid";
// import GenerateFilter from "@/components/generateFilter";
// import dataQuery from "@/components/dataQuery";
import { Row, Col } from "react-grid-system";
import { Slider, Grid, Select } from "@mui/material";
import { useMoviesList } from "@/contexts/apiContext";

// function searchFilter(text, data) {
//   return data.filter(
//     (movie) =>
//       movie.Movie.toLowerCase().includes(text.toLowerCase()) ||
//       movie.Actors.toLowerCase().includes(text.toLowerCase()) ||
//       movie.Director.toLowerCase().includes(text.toLowerCase()) ||
//       movie.Universe.toLowerCase().includes(text.toLowerCase()) ||
//       movie.Sub_Universe.toLowerCase().includes(text.toLowerCase()) ||
//       movie.Studio.toLowerCase().includes(text.toLowerCase())
//   );
// }

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

  //   function resetFilter() {
  //     setSelected([]);
  //     setSliderValue([0, 1000]);
  //     setTable(dataQuery([], { data }, sliderValue));
  //     setShowDropdown(false);
  //   }
  const [movies, setMovies] = useState<Movie[]>([]);
  const [params, setParams] = useState<MovieListQuery>({});
  const [showDropdown, setShowDropdown] = useState(false);

  const listMovies = useMoviesList(params, {
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (listMovies.isSuccess) {
      setMovies(listMovies.data.sort((a, b) => b.jh_score - a.jh_score));
    } else if (listMovies.isError) {
      console.log(listMovies.error);
    }
  }, [listMovies.isFetching]);

  //   const [table, setTable] = useState(nodes);
  //   const [selected, setSelected] = useState([]);
  //   const filter = GenerateFilter({ data });
  //   const [sliderValue, setSliderValue] = useState([0, 1000]);

  //   function getSelected(type) {
  //     var defselected = [];
  //     selected
  //       ? selected.forEach((value) => {
  //           if (type.toLowerCase() === value.category.toLowerCase())
  //             defselected.push(value);
  //         })
  //       : (defselected = []);
  //     return defselected;
  //   }

  return (
    <Layout pageTitle="Movies">
      <Row>
        <Col md={2}></Col>
        <Col md={4} style={{ textAlign: "center" }}>
          {/* <ReactSearchBox
              placeholder="Search for Title, Actor, Director..."
              onChange={(value) =>
                searchFilter(value, dataQuery(selected, { data }, sliderValue))
                  .length !== 0
                  ? setTable(
                      searchFilter(
                        value,
                        dataQuery(selected, { data }, sliderValue)
                      )
                    )
                  : setTable(nodes)
              }
            /> */}
        </Col>
        <Col md={4}>
          <button
            style={{ borderRadius: "8px" }}
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
          >
            {showDropdown ? "Hide" : "Filters"} &#8597;
          </button>
        </Col>
      </Row>
      {showDropdown ? (
        <Grid
          container
          style={{
            marginBottom: "1rem",
            background: "#d4f0f0",
            paddingTop: "0.5rem",
          }}
        >
          {/* <Grid
              xs={6}
              item={true}
              key={1}
              style={{
                marginBottom: "0.5rem",
                textAlign: "right",
                paddingRight: "0.5rem",
              }}
            >
              <button
                style={{ width: "40%", borderRadius: "8px" }}
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setTable(dataQuery(selected, { data }, sliderValue));
                }}
              >
                Apply
              </button>
            </Grid> */}
          {/* <Grid
              xs={6}
              item={true}
              key={2}
              style={{ marginBottom: "0.5rem", paddingLeft: "0.5rem" }}
            >
              <button
                style={{ width: "40%", borderRadius: "8px" }}
                onClick={() => {
                  resetFilter();
                }}
              >
                Reset
              </button>
            </Grid> */}
          {/* {filter.map((opt) => {
              if (!opt["Runtime"]) {
                return (
                  <Grid xs={12} md={6} item={true} key={`${opt["label"]}-12`}>
                    <div
                      key={`${opt["label"]}-select-picker`}
                      style={{ textAlign: "center" }}
                    >
                      {opt["label"]}
                    </div>
                    <Select
                      className={reactSelectContainer}
                      classNamePrefix="react-select"
                      defaultValue={getSelected(opt["label"])}
                      options={opt["options"]}
                      isMulti
                      closeMenuOnSelect={false}
                      isSearchable
                      placeholder={
                        opt["label"] === "Genre"
                          ? "Ex: Animated, Horror"
                          : `Ex: ${opt["options"][0]["label"]}`
                      }
                      onChange={(e) => {
                        setSelected((prevState) =>
                          selectedOptions(prevState, e, opt["label"])
                        );
                      }}
                    ></Select>
                  </Grid>
                );
              } else {
                return (
                  <Grid xs={12} md={6} item={true} key={`runtime-12`}>
                    <div key={`runtime-slider`} style={{ textAlign: "center" }}>
                      Runtime
                    </div>
                    <Slider
                      min={opt["Runtime"][0]}
                      max={opt["Runtime"][opt["Runtime"].length - 1]}
                      onChange={handleChange}
                      style={{
                        width: "95%",
                        marginLeft: "2.5%",
                        color: "#55CBCD",
                      }}
                      value={sliderValue}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(x) => {
                        return `${x} min`;
                      }}
                    />
                  </Grid>
                );
              }
            })} */}
        </Grid>
      ) : null}
      <Row>
        <MovieGrid movies={movies} />
      </Row>
    </Layout>
  );
};

export default MoviePage;
