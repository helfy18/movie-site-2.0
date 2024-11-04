import {
  Button,
  Divider,
  Grid,
  Grid2,
  IconButton,
  ListSubheader,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";
import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SelectWrapper, {
  getMenuProps,
  handleChange,
  sxProp,
} from "./selectWrapper";

interface fitersProps {
  filterTypes: AllType;
  onClear: () => void;
  onApply: (params: MovieListQuery) => void;
  values: MovieListQuery;
}

const buildGenreFilter = (genres: FilterType[]) => {
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
};

const generateDecades = (years: number[]) => {
  return Array.from(
    new Set(
      years.map((year) => {
        const start = Math.floor(year / 10) * 10;
        const end = start + 9;
        return `${start}-${end}`;
      })
    )
  );
};

const getDirectors = (directors: FilterType[]) => {
  return directors
    .map((director) => director.fieldValue)
    .sort((a, b) => a.localeCompare(b));
};

export default function Filters({
  filterTypes,
  onApply,
  onClear,
  values,
}: fitersProps) {
  const [directors, setDirectors] = useState<string[]>(values.director ?? []);
  const [exclusives, setExclusives] = useState<string[]>(
    values.exclusive ?? []
  );
  const [studios, setStudios] = useState<string[]>(values.studio ?? []);
  const [years, setYears] = useState<string[]>(values.year ?? []);
  const [holidays, setHolidays] = useState<string[]>(values.holiday ?? []);
  const [decades, setDecades] = useState<string[]>(values.decade ?? []);
  const [genres, setGenres] = useState<string[]>(values.genre ?? []);
  const [universes, setUniverses] = useState<string[]>(values.universe ?? []);
  const [runtime, setRuntime] = useState<number[]>(
    values.runtime ?? [filterTypes.runtime[0].min, filterTypes.runtime[0].max]
  );

  const handleRuntimeChange = (_: Event, newValue: number | number[]) => {
    setRuntime(newValue as number[]);
  };

  const onSubmit = () => {
    onApply({
      genre: genres,
      director: directors,
      exclusive: exclusives,
      studio: studios,
      year: years,
      holiday: holidays,
      universe: universes,
      runtime: runtime,
      decade: decades,
    });
  };

  const genreOptions = buildGenreFilter(filterTypes.genre);
  const sortedUniverses = filterTypes.universes
    .filter((val) => val.fieldValue)
    .sort((a, b) => {
      // Step 1: Sort by whether `subUniverses` array has items
      if (a.subUniverses.length > 1 && b.subUniverses.length <= 1) return -1;
      if (a.subUniverses.length <= 1 && b.subUniverses.length > 1) return 1;
      // Step 2: If both have `subUniverses`, sort by `totalCount` descending
      if (a.subUniverses.length > 1 && b.subUniverses.length > 1) {
        return b.totalCount - a.totalCount;
      }
      // Step 3: If both have empty `subUniverses`, sort by `fieldValue` ascending
      return a.fieldValue.localeCompare(b.fieldValue);
    });

  return (
    <>
      <Grid2 container className="mb-4 pt-2 bg-stone-700">
        <Grid2 size={{ xs: 6 }} key={1} className="mb-2 px-2 text-right">
          <Button
            sx={{
              width: "50%",
              borderRadius: "0.5rem",
              color: "secondary.main",
              outline: "1px solid",
            }}
            onClick={onSubmit}
          >
            Apply
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
            onClick={onClear}
          >
            Reset
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }} className="py-0 px-2">
          <div className="text-center">Genre</div>
          <div className="flex items-center gap-2">
            <Select
              multiple
              value={genres}
              onChange={(event) => handleChange(event, setGenres)}
              className="w-full"
              MenuProps={getMenuProps()}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <span className="text-secondary text-opacity-20">
                      Ex: {genreOptions.Popular[0]}, {genreOptions.Popular[1]}
                    </span>
                  );
                }
                return selected.join(", ");
              }}
              sx={sxProp}
            >
              <ListSubheader>Popular Genres</ListSubheader>
              {genreOptions.Popular.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
              <ListSubheader>More Genres</ListSubheader>
              {genreOptions.More.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {genres.length > 0 && (
              <IconButton
                onClick={() => setGenres([])}
                aria-label="clear selection"
              >
                <ClearIcon color="secondary" />
              </IconButton>
            )}
          </div>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }} className="py-0 px-2">
          <div className="text-center">Universe</div>
          <div className="flex items-center gap-2">
            <Select
              multiple
              value={universes}
              onChange={(event) => handleChange(event, setUniverses)}
              className="w-full text-secondary"
              MenuProps={getMenuProps()}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <span className="text-secondary text-opacity-20">
                      Ex: {sortedUniverses[0].fieldValue},{" "}
                      {sortedUniverses[1].fieldValue}
                    </span>
                  );
                }
                return selected.join(", ");
              }}
              sx={sxProp}
            >
              {sortedUniverses.flatMap((universe) =>
                universe.subUniverses.length > 1
                  ? [
                      <ListSubheader key={`header-${universe.fieldValue}`}>
                        {universe.fieldValue}
                      </ListSubheader>,
                      ...universe.subUniverses
                        .sort((a, b) =>
                          a.fieldValue.localeCompare(b.fieldValue)
                        )
                        .map((subUniverse) => (
                          <MenuItem
                            key={`${universe.fieldValue}-${subUniverse.fieldValue}`}
                            value={subUniverse.fieldValue}
                          >
                            {subUniverse.fieldValue}
                          </MenuItem>
                        )),
                      <MenuItem
                        key={`all-${universe.fieldValue}`}
                        value={universe.fieldValue}
                      >
                        All {universe.fieldValue}
                      </MenuItem>,
                      <Divider key={`divider-${universe.fieldValue}`} />,
                    ]
                  : [
                      <MenuItem
                        key={universe.fieldValue}
                        value={universe.fieldValue}
                      >
                        {universe.fieldValue}
                      </MenuItem>,
                    ]
              )}
            </Select>
            {universes.length > 0 && (
              <IconButton
                onClick={() => setUniverses([])}
                aria-label="clear selection"
              >
                <ClearIcon color="secondary" />
              </IconButton>
            )}
          </div>
        </Grid2>
        <SelectWrapper
          selected={directors}
          setSelected={setDirectors}
          options={getDirectors(filterTypes.director)}
          title="Director"
        />
        <SelectWrapper
          selected={studios}
          setSelected={setStudios}
          options={filterTypes.studio}
          title="Studio"
        />
        <SelectWrapper
          selected={years}
          setSelected={setYears}
          options={filterTypes.year.map(String)}
          title="Year"
        />
        <SelectWrapper
          selected={exclusives}
          setSelected={setExclusives}
          options={filterTypes.exclusive}
          title="Exclusive"
        />
        <SelectWrapper
          selected={holidays}
          setSelected={setHolidays}
          options={filterTypes.holiday}
          title="Holiday"
        />
        <SelectWrapper
          selected={decades}
          setSelected={setDecades}
          options={generateDecades(filterTypes.year)}
          title="Decade"
        />
        <Grid2 size={{ xs: 12 }} className="py-0 px-2">
          <div className="text-center">Runtime</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Slider
              min={filterTypes.runtime[0].min}
              max={filterTypes.runtime[0].max}
              valueLabelDisplay="auto"
              color="secondary"
              value={runtime}
              valueLabelFormat={(val: number) => `${val} min`}
              onChange={handleRuntimeChange}
            />
          </div>
        </Grid2>
      </Grid2>
    </>
  );
}
