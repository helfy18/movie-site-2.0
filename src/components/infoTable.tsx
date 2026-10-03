import { Box, Stack, Grid, Collapse } from "@mui/material";
import { scoreColor } from "@/styles/gradient";
import { Item } from "./item";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { CSSProperties, useState } from "react";
import { gridLink } from "@/utils";

type GridQueryKey = "universe" | "genre" | "director" | "studio";

interface Row {
  label: string;
  value?: string | number;
  style?: CSSProperties;
  queryType?: GridQueryKey;
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

const InfoTable = ({ movie }: InfoTableProps) => {
  const [expanded, setExpanded] = useState(false);

  const rows: Row[] = [
    { label: "Title", value: movie.movie },
    {
      label: "Score",
      value: `${movie.jh_score}/100`,
      style: { color: scoreColor(movie.jh_score), fontWeight: "bolder" },
    },
    { label: "Universe", value: movie.universe, queryType: "universe" },
    { label: "Sub Universe", value: movie.sub_universe, queryType: "universe" },
    { label: "Genre", value: movie.genre, queryType: "genre" },
    { label: "Secondary Genre", value: movie.genre_2, queryType: "genre" },
    { label: "Exclusive", value: movie.exclusive },
    { label: "Holiday", value: movie.holiday },
    { label: "Year", value: movie.year },
    { label: "MPA Rating", value: movie.rated },
    { label: "Runtime", value: `${movie.runtime} min` },
    { label: "Budget", value: money(movie.budget) },
    { label: "Box Office", value: money(movie.boxoffice) },
    { label: "Actors", value: movie.actors },
    { label: "Director", value: movie.director, queryType: "director" },
    { label: "Studio", value: movie.studio, queryType: "studio" },
  ];

  return (
    <Item sx={{ color: "secondary.main" }}>
      <Stack spacing={1.5}>
        {rows.map(({ label, value, style, queryType }) =>
          value ? (
            <Grid container key={label}>
              <Grid size={4}>{label}</Grid>
              <Grid size={8} style={style}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  style={style}
                >
                  {label === "Actors" ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <Collapse in={expanded} collapsedSize={50}>
                        {value}
                      </Collapse>
                      <Box
                        onClick={() => setExpanded(!expanded)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        {expanded ? "Show less" : "Show more"}
                      </Box>
                    </Box>
                  ) : (
                    <span>{value}</span>
                  )}
                  {queryType && (
                    <Link
                      href={gridLink(singleFilter(queryType, String(value)))}
                    >
                      <SearchIcon sx={{ cursor: "pointer", ml: 1 }} />
                    </Link>
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
