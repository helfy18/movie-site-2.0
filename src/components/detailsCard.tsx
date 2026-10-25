import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { Item } from "./item";
import { gridLink } from "@/utils";

interface Props {
  movie: Movie;
  totalCount?: number;
}

const money = (value: string) =>
  value && value !== "0" ? `$${value}` : undefined;

const GridLink = ({
  query,
  children,
}: {
  query: MovieListQuery;
  children: React.ReactNode;
}) => (
  <Link href={gridLink(query)} className="underline underline-offset-4">
    {children}
  </Link>
);

const DetailsCard = ({ movie, totalCount }: Props) => {
  const reviewed = movie.jh_score !== -1;
  const rows: { label: string; value: React.ReactNode }[] = [
    ...(reviewed
      ? [
          { label: "Score", value: `${movie.jh_score} / 100` },
          {
            label: "Ranking",
            value: `#${movie.ranking} of ${totalCount?.toLocaleString() ?? "…"}`,
          },
        ]
      : []),
    { label: "Budget", value: money(movie.budget) },
    { label: "Box office", value: money(movie.boxoffice) },
    {
      label: "Studio",
      value: movie.studio && (
        <GridLink query={{ studio: [movie.studio] }}>{movie.studio}</GridLink>
      ),
    },
    {
      label: "Universe",
      value: movie.universe && (
        <>
          <GridLink query={{ universe: [movie.universe] }}>
            {movie.universe}
          </GridLink>
          {movie.sub_universe && (
            <>
              {" · "}
              <GridLink query={{ universe: [movie.sub_universe] }}>
                {movie.sub_universe}
              </GridLink>
            </>
          )}
        </>
      ),
    },
    ...(reviewed && movie.dani_approved
      ? [{ label: "Dani", value: "Approved" }]
      : []),
  ].filter((row) => Boolean(row.value));
  if (rows.length === 0) return null;

  return (
    <Item sx={{ px: 2, py: 1.75, alignSelf: "start" }}>
      <Typography
        component="h2"
        sx={{
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "text.disabled",
          fontWeight: 600,
          mb: 1.25,
        }}
      >
        Details
      </Typography>
      <Box
        component="dl"
        sx={{
          m: 0,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "7px 14px",
          fontSize: "0.9rem",
          "& dt": { color: "text.disabled" },
          "& dd": {
            m: 0,
            color: "text.secondary",
            fontVariantNumeric: "tabular-nums",
          },
        }}
      >
        {rows.map((row) => (
          <Box key={row.label} sx={{ display: "contents" }}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </Box>
        ))}
      </Box>
    </Item>
  );
};

export default DetailsCard;
