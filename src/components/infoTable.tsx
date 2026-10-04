import { Box, Chip, Stack, Grid, Collapse } from "@mui/material";
import { scoreColor } from "@/styles/gradient";
import { Item } from "./item";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { CSSProperties, useState } from "react";
import { gridLink, personLink } from "@/utils";

type GridQueryKey =
  | "universe"
  | "genre"
  | "director"
  | "studio"
  | "year"
  | "holiday"
  | "exclusive";

interface Row {
  label: string;
  value?: string | number;
  style?: CSSProperties;
  chipKey?: GridQueryKey;
  chips?: string[];
}

interface InfoTableProps {
  movie: Movie;
}

const money = (value: string) =>
  value && value !== "0" ? `$${value}` : undefined;

const singleFilter = (key: GridQueryKey, value: string): MovieListQuery => {
  const query: MovieListQuery = {};
  query[key] = [value];
  return query;
};

const toChips = (value?: string) => (value ? [value] : []);

const InfoTable = ({ movie }: InfoTableProps) => {
  const [expanded, setExpanded] = useState(false);
  const cast = movie.cast ?? [];
  const directors = movie.directors ?? [];
  const genres = [movie.genre, movie.genre_2].filter(Boolean) as string[];

  const rows: Row[] = [
    { label: "Title", value: movie.movie },
    {
      label: "Score",
      value: `${movie.jh_score}/100`,
      style: { color: scoreColor(movie.jh_score), fontWeight: "bolder" },
    },
    { label: "Universe", chips: toChips(movie.universe), chipKey: "universe" },
    {
      label: "Sub Universe",
      chips: toChips(movie.sub_universe),
      chipKey: "universe",
    },
    {
      label: genres.length > 1 ? "Genres" : "Genre",
      chips: genres,
      chipKey: "genre",
    },
    {
      label: "Exclusive",
      chips: toChips(movie.exclusive),
      chipKey: "exclusive",
    },
    { label: "Holiday", chips: toChips(movie.holiday), chipKey: "holiday" },
    { label: "Year", chips: [String(movie.year)], chipKey: "year" },
    { label: "MPA Rating", value: movie.rated },
    { label: "Runtime", value: `${movie.runtime} min` },
    { label: "Budget", value: money(movie.budget) },
    { label: "Box Office", value: money(movie.boxoffice) },
    { label: "Actors", chips: cast },
    {
      label: directors.length > 1 ? "Directors" : "Director",
      chips: directors,
      chipKey: "director",
    },
    { label: "Studio", chips: toChips(movie.studio), chipKey: "studio" },
  ];

  return (
    <Item sx={{ color: "secondary.main" }}>
      <Stack spacing={1.5}>
        {rows.map(({ label, value, style, chipKey, chips }) =>
          value || chips?.length ? (
            <Grid
              container
              key={label}
              sx={
                chips?.length
                  ? {
                      alignItems: label === "Actors" ? "flex-start" : "center",
                    }
                  : undefined
              }
            >
              <Grid size={4}>{label}</Grid>
              <Grid size={8} style={style}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  style={style}
                >
                  {chips?.length && chipKey ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {chips.map((name) => (
                        <Chip
                          key={name}
                          label={name}
                          component={Link}
                          href={
                            chipKey === "director"
                              ? personLink(name)
                              : gridLink(singleFilter(chipKey, name))
                          }
                          variant="outlined"
                          color="secondary"
                          sx={{ fontSize: "1rem" }}
                          clickable
                        />
                      ))}
                    </Box>
                  ) : label === "Actors" ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <Collapse in={expanded} collapsedSize={68}>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {cast.map((name) => (
                            <Chip
                              key={name}
                              label={name}
                              component={Link}
                              href={personLink(name)}
                              variant="outlined"
                              color="secondary"
                              sx={{ fontSize: "1rem" }}
                              clickable
                            />
                          ))}
                        </Box>
                      </Collapse>
                      <Box
                        onClick={() => setExpanded(!expanded)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          gap: 1,
                          mb: 0.5,
                          fontSize: "0.875rem",
                          color: "text.disabled",
                          "&:hover": { color: "secondary.main" },
                        }}
                      >
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        {expanded ? "Show less" : "Show more"}
                      </Box>
                    </Box>
                  ) : (
                    <span>{value}</span>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : null,
        )}
      </Stack>
    </Item>
  );
};

export default InfoTable;
