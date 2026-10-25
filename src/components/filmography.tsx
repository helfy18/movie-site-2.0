import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Poster } from "./posterRow";

interface Props {
  title: string;
  movies: FilmographyMovie[];
}

type Sort = "score" | "year" | "billing";

// Desktop shows this many before "Show all"; phones get a scrolling row.
const DESKTOP_CAP = 16;

const sorters: Record<
  Sort,
  (a: FilmographyMovie, b: FilmographyMovie) => number
> = {
  score: (a, b) => b.jh_score - a.jh_score,
  year: (a, b) => b.year - a.year || b.jh_score - a.jh_score,
  billing: (a, b) =>
    (a.billing ?? Infinity) - (b.billing ?? Infinity) ||
    b.jh_score - a.jh_score,
};

const Filmography = ({ title, movies }: Props) => {
  const [sort, setSort] = useState<Sort>("score");
  const [expanded, setExpanded] = useState(false);
  const hasBilling = movies.some((movie) => movie.billing !== null);
  const sorted = useMemo(() => [...movies].sort(sorters[sort]), [movies, sort]);
  if (movies.length === 0) return null;

  const options: { key: Sort; label: string }[] = [
    { key: "score", label: "Your score" },
    { key: "year", label: "Year" },
    ...(hasBilling ? [{ key: "billing" as Sort, label: "Billing" }] : []),
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Typography
          component="h2"
          sx={{ fontSize: "1.25rem", fontWeight: 700 }}
        >
          {title} ({movies.length})
        </Typography>
        <Box
          role="group"
          aria-label="Sort"
          sx={{
            display: "flex",
            gap: 0.5,
            p: 0.5,
            borderRadius: "10px",
            bgcolor: "background.paper",
          }}
        >
          {options.map((option) => (
            <Button
              key={option.key}
              size="small"
              onClick={() => setSort(option.key)}
              aria-pressed={sort === option.key}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8rem",
                px: 1.25,
                borderRadius: "8px",
                color: sort === option.key ? "#1c1917" : "text.disabled",
                bgcolor: sort === option.key ? "secondary.main" : "transparent",
                "&:hover": {
                  bgcolor: sort === option.key ? "secondary.main" : "#36312d",
                },
              }}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: { xs: "flex", md: "grid" },
          gridTemplateColumns: "repeat(auto-fill, 116px)",
          justifyContent: { md: "space-between" },
          gap: 2,
          overflowX: { xs: "auto", md: "visible" },
          pb: { xs: 1, md: 0 },
          mx: { xs: -2, md: 0 },
          px: { xs: 2, md: 0 },
        }}
      >
        {sorted.map((movie, index) => (
          <Box
            key={movie.tmdbid}
            sx={{
              flex: "none",
              display: {
                xs: "block",
                md: expanded || index < DESKTOP_CAP ? "block" : "none",
              },
            }}
          >
            <Link
              href={`/movie/${movie.tmdbid}`}
              prefetch={false}
              style={{ textDecoration: "none" }}
            >
              <Poster movie={movie} priority={index < 8} />
            </Link>
          </Box>
        ))}
      </Box>
      {movies.length > DESKTOP_CAP && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setExpanded((previous) => !previous)}
          sx={{
            display: { xs: "none", md: "flex" },
            width: "100%",
            mt: 2,
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "10px",
          }}
        >
          {expanded ? "Show fewer" : `Show all ${movies.length}`}
        </Button>
      )}
    </Box>
  );
};

export default Filmography;
