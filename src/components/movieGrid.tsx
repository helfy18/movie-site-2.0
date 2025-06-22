import { useState } from "react";
import { Button, Grid2 } from "@mui/material";
import Link from "next/link";
import Gradient from "javascript-color-gradient";
import { Poster } from "./posterRow";

export const gradient = new Gradient()
  .setColorGradient("#b91c1c", "#facc15", "#15803d")
  .setMidpoint(101)
  .getColors();

interface MovieGridProps {
  movies: Movie[];
}

const moviesPerPage: number = 48;

export default function MovieGrid({ movies }: MovieGridProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  movies.sort((a, b) => b.jh_score - a.jh_score);

  const lastMovie = currentPage * moviesPerPage;
  const firstMovie = lastMovie - moviesPerPage;
  const currentMovies = movies.slice(firstMovie, lastMovie);

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
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
    <Grid2>
      <Grid2 container spacing={2} className="justify-center">
        {currentMovies.map((movie) => {
          return (
            <Grid2 size={{ xs: "auto" }} key={movie.tmdbid}>
              <Link href={`/movie-page?id=${movie.tmdbid}`}>
                <Poster movie={movie} isLink={true} />
              </Link>
            </Grid2>
          );
        })}
      </Grid2>
      <Grid2 container spacing={2} className="justify-center text-center mt-5">
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
                sx={{
                  color:
                    page === currentPage ? "text-stone-500" : "secondary.main",
                }}
              >
                {page}
              </Button>
            )
          )}
        </div>
      </Grid2>
    </Grid2>
  );
}
