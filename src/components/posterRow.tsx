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
  height: "250px",
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
        style={{ overflowX: "scroll", overflowY: "clip" }}
      >
        {movies.map((movie, index) => {
          const eager = priority && index < 6;
          return (
            movie && (
              <Grid size={{ xs: "auto" }} key={movie.tmdbid} sx={{ mb: 1 }}>
                {movie.jh_score !== -1 ? (
                  <Link
                    href={`/movie/${movie.tmdbid}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Poster movie={movie} isLink priority={eager} />
                  </Link>
                ) : (
                  <Poster movie={movie} priority={eager} />
                )}
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
  isLink,
  priority = false,
}: {
  movie: PosterMovie;
  isLink?: boolean;
  priority?: boolean;
}) => (
  <PosterItem
    style={{
      cursor: movie.jh_score === -1 && !isLink ? "not-allowed" : "pointer",
    }}
  >
    <Box
      sx={{
        px: "0rem",
        position: "relative",
        display: "inline-block",
        width: "100%",
      }}
    >
      <Image
        src={movie.poster}
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
        WebkitLineClamp: 4,
      }}
    >
      {movie.movie}
    </Typography>
  </PosterItem>
);

export default PosterRow;
