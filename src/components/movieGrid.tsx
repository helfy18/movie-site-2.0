import { Button, Grid } from "@mui/material";
import Link from "next/link";
import { Poster } from "./posterRow";

interface MovieGridProps {
  movies: PosterMovie[];
  page: number;
  onPageChange: (page: number) => void;
}

const moviesPerPage: number = 48;

export default function MovieGrid({
  movies,
  page,
  onPageChange,
}: MovieGridProps) {
  const totalPages = Math.max(1, Math.ceil(movies.length / moviesPerPage));
  const currentPage = Math.min(page, totalPages);
  const lastMovie = currentPage * moviesPerPage;
  const firstMovie = lastMovie - moviesPerPage;
  const currentMovies = movies.slice(firstMovie, lastMovie);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo(0, 0);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const range = 2;

    const startPage = Math.max(1, currentPage - range);
    const endPage = Math.min(totalPages, currentPage + range);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }

    if (startPage > 1) {
      pages.unshift("...");
      pages.unshift(1);
    }

    return pages;
  };

  return (
    <Grid>
      <Grid container spacing={2} className="justify-center">
        {currentMovies.map((movie) => {
          return (
            <Grid size={{ xs: "auto" }} key={movie.tmdbid}>
              <Link href={`/movie/${movie.tmdbid}`}>
                <Poster movie={movie} isLink={true} />
              </Link>
            </Grid>
          );
        })}
      </Grid>
      <Grid container spacing={2} className="justify-center text-center mt-5">
        <div>
          {generatePageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="mx-2">
                {page}
              </span>
            ) : (
              <Button
                key={index}
                onClick={() => handlePageChange(Number(page))}
                disabled={page === currentPage}
                sx={{ color: "secondary.main" }}
              >
                {page}
              </Button>
            ),
          )}
        </div>
      </Grid>
    </Grid>
  );
}
