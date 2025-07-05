import { Box, Grid2, Paper, styled, Tooltip } from "@mui/material";
import { gradient } from "./movieGrid";
import Image from "next/image";
import { ArrowForward } from "@mui/icons-material";
import Link from "next/link";

interface Props {
  movies: Movie[];
  title: string;
  link?: { url: string; onClick: () => void };
}

const PosterItem = styled(Paper)(({ theme }) => ({
  backgroundColor: "#44403c",
  padding: theme.spacing(1),
  textAlign: "center",
  color: "#f5f5f5",
  fontFamily: "Arial",
  height: "250px",
  width: "100px",
  fontSize: "13px",
  boxSizing: "content-box",
  justifyContent: "center",
}));

const PosterRow = ({ movies, title, link }: Props) => {
  return (
    <>
      <header className="w-full font-bold text-xl my-2 flex justify-between items-center">
        <span>{title}</span>
        {link && (
          <Link
            href={link.url}
            onClick={link.onClick}
            style={{ textDecoration: "none", color: "secondary.main" }}
          >
            VIEW ALL <ArrowForward fontSize="small" />
          </Link>
        )}
      </header>
      <Grid2
        container
        spacing={2}
        wrap="nowrap"
        style={{ overflowX: "scroll", overflowY: "clip" }}
      >
        {movies.map((movie) => {
          return (
            movie && (
              <Grid2 size={{ xs: "auto" }} key={movie.tmdbid} mb={1}>
                {movie.jh_score !== -1 ? (
                  <Link
                    href={`/movie-page?id=${movie.tmdbid}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Poster movie={movie} isLink />
                  </Link>
                ) : (
                  <Poster movie={movie} />
                )}
              </Grid2>
            )
          );
        })}
      </Grid2>
    </>
  );
};

export const Poster = ({
  movie,
  isLink,
}: {
  movie: Movie;
  isLink?: boolean;
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
      <Image src={movie.poster} height={163} width={110} alt="Not Found" />
      {movie.dani_approved && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 40,
            height: 40,
          }}
        >
          <Tooltip title="Dani Approved" arrow>
            <Image
              src="/dani.png"
              alt="Verified"
              fill
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        </Box>
      )}
    </Box>
    <Box
      style={{
        color: gradient[movie.jh_score],
        fontWeight: "bolder",
      }}
    >
      {movie.jh_score !== -1 ? `${movie.jh_score}/100` : "N/A"}
    </Box>
    <Box>{movie.movie}</Box>
  </PosterItem>
);

export default PosterRow;
