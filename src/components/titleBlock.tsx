import { Box, Chip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import ScoreRing from "./scoreRing";
import { gridLink, personLink } from "@/utils";

interface Props {
  movie: Movie;
  totalCount?: number;
  onDaniClick: () => void;
}

const TextLink = ({
  href,
  children,
}: {
  href: Parameters<typeof Link>[0]["href"];
  children: React.ReactNode;
}) => (
  <Box
    component={Link}
    href={href}
    sx={{
      color: "text.secondary",
      textDecoration: "underline",
      textUnderlineOffset: "3px",
    }}
  >
    {children}
  </Box>
);

const TitleBlock = ({ movie, totalCount, onDaniClick }: Props) => {
  const reviewed = movie.jh_score !== -1;
  const directors = movie.directors ?? [];
  const genres = [movie.genre, movie.genre_2, movie.genre_3].filter(
    Boolean,
  ) as string[];
  const chips = [
    ...(movie.universe
      ? [{ label: movie.universe, query: { universe: [movie.universe] } }]
      : []),
    ...(movie.sub_universe
      ? [
          {
            label: movie.sub_universe,
            query: { universe: [movie.sub_universe] },
          },
        ]
      : []),
    ...genres.map((genre) => ({ label: genre, query: { genre: [genre] } })),
    ...(movie.holiday
      ? [{ label: movie.holiday, query: { holiday: [movie.holiday] } }]
      : []),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
        pt: 1,
        pb: 2,
        borderBottom: "1px solid",
        borderColor: "background.paper",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "2.75rem" },
            lineHeight: 1.05,
            color: "text.secondary",
            letterSpacing: "-0.01em",
            mb: 1,
          }}
        >
          {movie.movie}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.disabled",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 12px",
          }}
        >
          {movie.year > 0 && (
            <TextLink href={gridLink({ year: [String(movie.year)] })}>
              {movie.year}
            </TextLink>
          )}
          {movie.rated && <span>{movie.rated}</span>}
          {movie.runtime > 0 && <span>{movie.runtime} min</span>}
          {directors.length > 0 && (
            <span>
              Directed by{" "}
              {directors.map((name, index) => (
                <span key={name}>
                  {index > 0 && ", "}
                  <TextLink href={personLink(name)}>{name}</TextLink>
                </span>
              ))}
            </span>
          )}
        </Typography>
        {chips.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.25 }}>
            {chips.map((chip) => (
              <Chip
                key={chip.label}
                label={chip.label}
                component={Link}
                href={gridLink(chip.query)}
                variant="outlined"
                color="secondary"
                size="small"
                clickable
              />
            ))}
          </Box>
        )}
        {reviewed && movie.dani_approved && (
          <Box
            component="button"
            onClick={onDaniClick}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              alignItems: "center",
              gap: 0.75,
              mt: 1.25,
              p: 0,
              border: 0,
              background: "none",
              color: "secondary.main",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            <Image src="/dani.png" alt="" width={18} height={18} />
            Dani approved
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 0.5, md: 1.75 },
          flex: "none",
        }}
      >
        {reviewed ? (
          <>
            <ScoreRing score={movie.jh_score} size={84} />
            <Box
              sx={{
                color: "text.disabled",
                fontSize: "0.8rem",
                lineHeight: 1.3,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                component="span"
                sx={{
                  display: "block",
                  color: "text.secondary",
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                #{movie.ranking}
              </Typography>
              <span style={{ display: "block" }}>
                of {totalCount?.toLocaleString() ?? "…"} rated
              </span>
              {movie.dani_approved && (
                <Box
                  component="button"
                  onClick={onDaniClick}
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    alignItems: "center",
                    gap: 0.75,
                    mt: 0.5,
                    p: 0,
                    border: 0,
                    background: "none",
                    color: "secondary.main",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <Image src="/dani.png" alt="" width={20} height={20} />
                  Dani approved
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Typography
            sx={{
              color: "secondary.main",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            Not yet reviewed
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TitleBlock;
