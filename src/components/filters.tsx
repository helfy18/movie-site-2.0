import { Grid, Select, Slider } from "@mui/material";

interface fitersProps {
  filterTypes: AllType;
}

function buildGenreFilter(genres: FilterType[]) {
  // Data management for the genre filter
  let genreStrings = genres
    .sort((a, b) => b.totalCount - a.totalCount)
    .map((genre) => genre.fieldValue);
  var popularGenres = genreStrings.slice(1, 11).sort((a, b) => {
    return a.localeCompare(b);
  });
  var moreGenres = genreStrings.slice(11).sort((a, b) => {
    return a.localeCompare(b);
  });
  return { Popular: popularGenres, More: moreGenres };
}

function generateDecades(years: number[]) {
  return Array.from(
    new Set(
      years.map((year) => {
        const start = Math.floor(year / 10) * 10;
        const end = start + 9;
        return `${start}-${end}`;
      })
    )
  );
}

export default function Filters({ filterTypes }: fitersProps) {
  console.log(filterTypes);
  console.log(buildGenreFilter(filterTypes?.genre));
  console.log(generateDecades(filterTypes.year));
  return <div></div>;
  // // Data management for the director filter
  // director.sort((a, b) => {
  //   return b.totalCount - a.totalCount;
  // });
  // director = director.slice(0, 30).sort((a, b) => {
  //   return a.fieldValue > b.fieldValue
  //     ? 1
  //     : a.fieldValue < b.fieldValue
  //     ? -1
  //     : 0;
  // }).map((dir) => dir.fieldValue);
  // var everything = [
  //   { Genre: extraGenres },
  //   { Universe: universes },
  //   { Exclusive: exclusive },
  //   { Studio: studio },
  //   { Holiday: holiday },
  //   { Year: years.sort().reverse() },
  //   { Director: director },
  //   { Rated: rated },
  //   { Decade: decades },
  //   { Runtime: runtime },
  // ];
  // for (var headerIndex in everything) {
  //   if (headerIndex !== (everything.length - 1).toString()) {
  //     for (const type in everything[headerIndex]) {
  //       let optionsArray = [];
  //       if (type === "Genre") {
  //         for (let arr of everything[headerIndex][type]) {
  //           let subOptionsArray = [];
  //           for (let entry of arr.options) {
  //             subOptionsArray.push({
  //               value: entry.fieldValue,
  //               label: entry.fieldValue,
  //               category: "Genre",
  //             });
  //           }
  //           optionsArray.push({ label: arr.label, options: subOptionsArray });
  //         }
  //       } else if (type === "Universe") {
  //         optionsArray = builtUniverses;
  //       } else {
  //         for (let opt of everything[headerIndex][type]) {
  //           optionsArray.push({ value: opt, label: opt, category: type });
  //         }
  //       }
  //       everything[headerIndex] = {
  //         label: type,
  //         options: optionsArray,
  //       };
  //     }
  //   }
  // }
  // return everything.map((opt) => {
  //   if (!opt["Runtime"]) {
  //     return (
  //       <Grid xs={12} md={6} item={true} key={`${opt["label"]}-12`}>
  //         <div
  //           key={`${opt["label"]}-select-picker`}
  //           style={{ textAlign: "center" }}
  //         >
  //           {opt["label"]}
  //         </div>
  //         <Select
  //           className={reactSelectContainer}
  //           classNamePrefix="react-select"
  //           defaultValue={getSelected(opt["label"])}
  //           options={opt["options"]}
  //           isMulti
  //           closeMenuOnSelect={false}
  //           isSearchable
  //           placeholder={
  //             opt["label"] === "Genre"
  //               ? "Ex: Animated, Horror"
  //               : `Ex: ${opt["options"][0]["label"]}`
  //           }
  //           onChange={(e) => {
  //             setSelected((prevState) =>
  //               selectedOptions(prevState, e, opt["label"])
  //             );
  //           }}
  //         ></Select>
  //       </Grid>
  //     );
  //   } else {
  //     return (
  //       <Grid xs={12} md={6} item={true} key={`runtime-12`}>
  //         <div key={`runtime-slider`} style={{ textAlign: "center" }}>
  //           Runtime
  //         </div>
  //         <Slider
  //           min={opt["Runtime"][0]}
  //           max={opt["Runtime"][opt["Runtime"].length - 1]}
  //           onChange={handleChange}
  //           style={{
  //             width: "95%",
  //             marginLeft: "2.5%",
  //             color: "#55CBCD",
  //           }}
  //           value={sliderValue}
  //           valueLabelDisplay="auto"
  //           valueLabelFormat={(x) => {
  //             return `${x} min`;
  //           }}
  //         />
  //       </Grid>
  //     );
  //   }
  // });
}
