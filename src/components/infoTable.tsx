import { Box, Stack, Grid2 } from "@mui/material";
import { gradient } from "./movieGrid";
import { Item } from "@/pages/movie-page";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { useState } from "react";

interface MovieGridProps {
  movie: Movie;
  onClick: (value: string | number, queryType: string) => void;
}

const InfoTable = ({ movie, onClick }: MovieGridProps) => {
  const [expanded, setExpanded] = useState(false);

  const rows = [
    { label: "Title", value: movie.movie },
    {
      label: "Score",
      value: `${movie.jh_score}/100`,
      style: { color: gradient[movie.jh_score], fontWeight: "bolder" },
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
    { label: "Budget", value: `$${movie.budget}` },
    { label: "Box Office", value: `$${movie.boxoffice}` },
    { label: "Actors", value: movie.actors },
    { label: "Director", value: movie.director },
    { label: "Studio", value: movie.studio, queryType: "studio" },
  ];

  return (
    <Item sx={{ color: "secondary.main" }}>
      <Stack spacing={1.5}>
        {rows.map(({ label, value, style, queryType }) =>
          value ? (
            <Grid2 container key={label}>
              <Grid2 size={4}>{label}</Grid2>
              <Grid2 size={8} style={style}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
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
                      <Box
                        sx={{
                          overflow: "hidden",
                          transition: "max-height 0.3s ease",
                          maxHeight: expanded ? "1000px" : "48px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            whiteSpace: "normal",
                          }}
                        >
                          {value}
                        </span>
                      </Box>
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
                        <span>{expanded ? "Show less" : "Show more"}</span>
                      </Box>
                    </Box>
                  ) : (
                    <span>{value}</span>
                  )}
                  {queryType && (
                    <Link href="/movie-grid">
                      <SearchIcon
                        sx={{ cursor: "pointer", ml: 1 }}
                        onClick={() => onClick(value, queryType)}
                      />
                    </Link>
                  )}
                </Box>
              </Grid2>
            </Grid2>
          ) : null
        )}
      </Stack>
    </Item>
  );
};

export default InfoTable;
