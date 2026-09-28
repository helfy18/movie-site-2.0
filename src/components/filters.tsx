import {
  Button,
  Divider,
  Grid2,
  ListSubheader,
  MenuItem,
  Slider,
} from "@mui/material";
import { useMemo, useState } from "react";
import SelectWrapper from "./selectWrapper";
import Image from "next/image";

interface FiltersProps {
  filterTypes: AllType;
  onClear: () => void;
  onApply: (params: MovieListQuery) => void;
  values: MovieListQuery;
  showScore?: boolean;
}

const byName = (a: string, b: string) => a.localeCompare(b);

const buildGenreFilter = (genres: FilterType[]) => {
  const genreStrings = [...genres]
    .sort((a, b) => b.totalCount - a.totalCount)
    .map((genre) => genre.fieldValue);
  return {
    Popular: genreStrings.slice(0, 10).sort(byName),
    More: genreStrings.slice(10).sort(byName),
  };
};

const generateDecades = (years: number[]) =>
  Array.from(
    new Set(
      years.map((year) => {
        const start = Math.floor(year / 10) * 10;
        return `${start}-${start + 9}`;
      }),
    ),
  );

const sortUniverses = (universes: Universe[]) =>
  universes
    .filter((val) => val.fieldValue)
    .sort((a, b) => {
      const aGrouped = a.subUniverses.length > 1;
      const bGrouped = b.subUniverses.length > 1;
      if (aGrouped && !bGrouped) return -1;
      if (!aGrouped && bGrouped) return 1;
      if (aGrouped && bGrouped) return b.totalCount - a.totalCount;
      return byName(a.fieldValue, b.fieldValue);
    });

const buttonSx = {
  width: "50%",
  borderRadius: "0.5rem",
  color: "secondary.main",
  outline: "1px solid",
};

export default function Filters({
  filterTypes,
  onApply,
  onClear,
  values,
  showScore = false,
}: FiltersProps) {
  const runtimeRange = [filterTypes.runtime[0].min, filterTypes.runtime[0].max];

  const [directors, setDirectors] = useState<string[]>(values.director ?? []);
  const [exclusives, setExclusives] = useState<string[]>(
    values.exclusive ?? [],
  );
  const [studios, setStudios] = useState<string[]>(values.studio ?? []);
  const [years, setYears] = useState<string[]>(values.year ?? []);
  const [providers, setProviders] = useState<string[]>(values.provider ?? []);
  const [holidays, setHolidays] = useState<string[]>(values.holiday ?? []);
  const [decades, setDecades] = useState<string[]>(values.decade ?? []);
  const [genres, setGenres] = useState<string[]>(values.genre ?? []);
  const [universes, setUniverses] = useState<string[]>(values.universe ?? []);
  const [runtime, setRuntime] = useState<number[]>(
    values.runtime ?? runtimeRange,
  );
  const [score, setScore] = useState<number[]>(values.rating ?? [0, 100]);

  const handleClear = () => {
    setDirectors([]);
    setExclusives([]);
    setStudios([]);
    setYears([]);
    setProviders([]);
    setHolidays([]);
    setDecades([]);
    setGenres([]);
    setUniverses([]);
    setRuntime(runtimeRange);
    setScore([0, 100]);
    onClear();
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
      runtime,
      decade: decades,
      provider: providers,
      rating: score,
    });
  };

  const genreOptions = useMemo(
    () => buildGenreFilter(filterTypes.genre),
    [filterTypes.genre],
  );
  const sortedUniverses = useMemo(
    () => sortUniverses(filterTypes.universes),
    [filterTypes.universes],
  );
  const directorOptions = useMemo(
    () => filterTypes.director.map((d) => d.fieldValue).sort(byName),
    [filterTypes.director],
  );
  const yearOptions = useMemo(
    () => [...filterTypes.year].sort((a, b) => b - a).map(String),
    [filterTypes.year],
  );
  const decadeOptions = useMemo(
    () => generateDecades(filterTypes.year),
    [filterTypes.year],
  );

  const universeItems = useMemo(() => {
    const grouped = sortedUniverses.filter((u) => u.subUniverses.length > 1);
    const other = sortedUniverses.filter((u) => u.subUniverses.length <= 1);
    return [
      ...grouped.flatMap((universe) => [
        <ListSubheader key={`header-${universe.fieldValue}`}>
          {universe.fieldValue}
        </ListSubheader>,
        ...[...universe.subUniverses]
          .sort((a, b) => byName(a.fieldValue, b.fieldValue))
          .map((sub) => (
            <MenuItem
              key={`${universe.fieldValue}-${sub.fieldValue}`}
              value={sub.fieldValue}
            >
              {sub.fieldValue}
            </MenuItem>
          )),
        <MenuItem
          key={`all-${universe.fieldValue}`}
          value={universe.fieldValue}
        >
          All {universe.fieldValue}
        </MenuItem>,
        <Divider key={`divider-${universe.fieldValue}`} />,
      ]),
      ...(other.length > 0
        ? [
            <ListSubheader key="misc-header">Other</ListSubheader>,
            ...other.map((universe) => (
              <MenuItem key={universe.fieldValue} value={universe.fieldValue}>
                {universe.fieldValue}
              </MenuItem>
            )),
          ]
        : []),
    ];
  }, [sortedUniverses]);

  const providerName = (id: string) =>
    filterTypes.provider.find((p) => String(p.provider_id) === id)
      ?.provider_name ?? id;

  return (
    <Grid2 container className="mb-4 pt-2 bg-card">
      <Grid2 size={{ xs: 6 }} className="mb-2 px-2 text-right">
        <Button sx={buttonSx} onClick={onSubmit}>
          Apply
        </Button>
      </Grid2>
      <Grid2 size={{ xs: 6 }} className="mb-2 px-2">
        <Button sx={buttonSx} onClick={handleClear}>
          Reset
        </Button>
      </Grid2>
      {showScore && (
        <Grid2 size={{ xs: 12 }} sx={{ p: 2 }}>
          <div className="text-center">Score</div>
          <Slider
            min={0}
            max={100}
            valueLabelDisplay="auto"
            color="secondary"
            value={score}
            onChange={(_, value) => setScore(value as number[])}
          />
        </Grid2>
      )}
      <SelectWrapper
        title="Genre"
        selected={genres}
        setSelected={setGenres}
        placeholder={`Ex: ${genreOptions.Popular[0]}, ${genreOptions.Popular[1]}`}
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
      </SelectWrapper>
      <SelectWrapper
        title="Universe"
        selected={universes}
        setSelected={setUniverses}
        placeholder={`Ex: ${sortedUniverses[0]?.fieldValue}, ${sortedUniverses[1]?.fieldValue}`}
      >
        {universeItems}
      </SelectWrapper>
      <SelectWrapper
        title="Director"
        selected={directors}
        setSelected={setDirectors}
        options={directorOptions}
      />
      <SelectWrapper
        title="Studio"
        selected={studios}
        setSelected={setStudios}
        options={filterTypes.studio}
      />
      <SelectWrapper
        title="Year"
        selected={years}
        setSelected={setYears}
        options={yearOptions}
      />
      <SelectWrapper
        title="Streaming Provider"
        selected={providers}
        setSelected={setProviders}
        placeholder={`Ex: ${filterTypes.provider[0]?.provider_name}, ${filterTypes.provider[1]?.provider_name}`}
        renderValue={(ids) => ids.map(providerName).join(", ")}
      >
        {filterTypes.provider.map((provider) => (
          <MenuItem
            key={provider.provider_id}
            value={String(provider.provider_id)}
          >
            <Grid2 container spacing={1}>
              <Image
                src={`https://image.tmdb.org/t/p/w154/${provider.logo_path}`}
                height={35}
                width={35}
                alt={provider.provider_name}
                className="rounded-full"
              />
              <Grid2 my="auto">{provider.provider_name}</Grid2>
            </Grid2>
          </MenuItem>
        ))}
      </SelectWrapper>
      <SelectWrapper
        title="Holiday"
        selected={holidays}
        setSelected={setHolidays}
        options={filterTypes.holiday}
      />
      <SelectWrapper
        title="Decade"
        selected={decades}
        setSelected={setDecades}
        options={decadeOptions}
      />
      <Grid2 size={{ xs: 12 }} sx={{ p: 2 }}>
        <div className="text-center">Runtime</div>
        <Slider
          min={runtimeRange[0]}
          max={runtimeRange[1]}
          valueLabelDisplay="auto"
          color="secondary"
          value={runtime}
          valueLabelFormat={(val: number) => `${val} min`}
          onChange={(_, value) => setRuntime(value as number[])}
        />
      </Grid2>
    </Grid2>
  );
}
