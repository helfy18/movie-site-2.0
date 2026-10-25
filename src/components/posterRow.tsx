import { Box, Grid, Paper, styled, Typography } from "@mui/material";
import DaniBadge from "./daniBadge";
import { scoreColor } from "@/styles/gradient";
import Image from "next/image";
import { ArrowForward } from "@mui/icons-material";
import Link, { LinkProps } from "next/link";

interface Props {
  movies: PosterMovie[];
  title: string;
  link?: LinkProps["href"];
  priority?: boolean;
}

const PosterItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: "100px",
  fontSize: "13px",
  boxSizing: "content-box",
  justifyContent: "center",
}));

const PosterRow = ({ movies, title, link, priority = false }: Props) => {
  return (
    <>
      <header className="w-full font-bold text-xl my-2 flex justify-between items-center">
        <span>{title}</span>
        {link && (
          <Link href={link} className="no-underline text-secondary">
            VIEW ALL <ArrowForward fontSize="small" />
          </Link>
        )}
      </header>
      <Grid
        container
        spacing={2}
        wrap="nowrap"
        style={{ overflowX: "auto", overflowY: "clip" }}
      >
        {movies.map((movie, index) => {
          const eager = priority && index < 10;
          return (
            movie && (
              <Grid size={{ xs: "auto" }} key={movie.tmdbid} sx={{ mb: 1 }}>
                <Link
                  href={`/movie/${movie.tmdbid}`}
                  style={{ textDecoration: "none" }}
                >
                  <Poster movie={movie} priority={eager} />
                </Link>
              </Grid>
            )
          );
        })}
      </Grid>
    </>
  );
};

export const Poster = ({
  movie,
  priority = false,
  fill = false,
}: {
  movie: PosterMovie;
  priority?: boolean;
  // Fill the parent instead of the fixed row width (the grid's columns).
  fill?: boolean;
}) => (
  <PosterItem
    style={{ cursor: "pointer" }}
    sx={
      fill
        ? {
            width: { xs: "auto", md: "100px" },
            boxSizing: { xs: "border-box", md: "content-box" },
          }
        : undefined
    }
  >
    <Box
      sx={{
        px: "0rem",
        position: "relative",
        display: "inline-block",
        width: "100%",
        ...(fill
          ? {
              "& > img": { width: "100%", height: "auto" },
            }
          : {}),
      }}
    >
      <Image
        src={movie.poster.replace("/w500/", "/w342/")}
        height={163}
        width={110}
        alt={movie.movie}
        priority={priority}
      />
      {movie.dani_approved && <DaniBadge size={40} />}
    </Box>
    <Typography
      style={{
        color: scoreColor(movie.jh_score),
        fontWeight: "bolder",
      }}
      variant="body2"
    >
      {movie.jh_score !== -1 ? `${movie.jh_score}/100` : "N/A"}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        lineHeight: 1.43,
        minHeight: "2.86em",
      }}
    >
      {movie.movie}
    </Typography>
  </PosterItem>
);

export default PosterRow;
