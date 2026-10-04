import Layout from "@/components/layout";
import { fetchMoviesListCompact, hasServerResponse } from "@/api/client";
import { fetchPerson } from "@/server/tmdb";
import { toPosterMovie } from "@/utils";
import { Avatar, Box, Collapse, Grid, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Item } from "@/components/item";
import PosterRow from "@/components/posterRow";
import ScoreBars from "@/components/scoreBars";
import { scoreColor } from "@/styles/gradient";

interface Props {
  name: string;
  person: TMDBPerson | null;
  directed: PosterMovie[];
  actedIn: PosterMovie[];
}

const bioCollapseChars = 300;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, { name: string }> = async ({
  params,
}) => {
  const name = params?.name;
  if (!name) return { notFound: true };

  let directed: CompactMovie[];
  let actedIn: CompactMovie[];
  try {
    [directed, actedIn] = await Promise.all([
      fetchMoviesListCompact({ director: [name] }),
      fetchMoviesListCompact({ actor: [name] }),
    ]);
  } catch (error) {
    if (hasServerResponse(error)) return { notFound: true, revalidate: 60 };
    throw error;
  }
  if (directed.length === 0 && actedIn.length === 0)
    return { notFound: true, revalidate: 3600 };

  const person = await fetchPerson(name).catch(() => null);

  return {
    props: {
      name,
      person,
      directed: directed.map(toPosterMovie),
      actedIn: actedIn.map(toPosterMovie),
    },
    revalidate: 3600,
  };
};

const byScore = (movies: PosterMovie[]) =>
  [...movies].sort((a, b) => b.jh_score - a.jh_score);

const MovieLink = ({ movie }: { movie: PosterMovie }) => (
  <Link href={`/movie/${movie.tmdbid}`} className="underline">
    {movie.movie}{" "}
    <Box
      component="span"
      sx={{ color: scoreColor(movie.jh_score), fontWeight: "bolder" }}
    >
      ({movie.jh_score})
    </Box>
  </Link>
);

const PersonPage = ({ name, person, directed, actedIn }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const directedSorted = useMemo(() => byScore(directed), [directed]);
  const actedSorted = useMemo(() => byScore(actedIn), [actedIn]);
  const rated = useMemo(
    () =>
      byScore([
        ...new Map(
          [...directed, ...actedIn].map((movie) => [movie.tmdbid, movie]),
        ).values(),
      ]),
    [directed, actedIn],
  );

  const avg =
    rated.reduce((sum, movie) => sum + movie.jh_score, 0) / (rated.length || 1);
  const best = rated[0];
  const worst = rated[rated.length - 1];
  const daniCount = rated.filter((movie) => movie.dani_approved).length;
  const bio = person?.biography?.trim();

  return (
    <Layout pageTitle={name}>
      <Head>
        <meta
          name="description"
          content={`${name}'s movies rated on JD Movies`}
        />
      </Head>
      <Item sx={{ color: "secondary.main", mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size="auto">
            <Box sx={{ width: { xs: 100, md: 150 } }}>
              {person?.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                  width={342}
                  height={513}
                  sizes="150px"
                  style={{ width: "100%", height: "auto" }}
                  alt={name}
                  className="rounded"
                />
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{
                    width: "100%",
                    height: { xs: 150, md: 225 },
                  }}
                >
                  <PersonIcon sx={{ fontSize: 80 }} />
                </Avatar>
              )}
            </Box>
          </Grid>
          <Grid size="grow">
            <Stack spacing={{ xs: 0.5, md: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {name}
              </Typography>
              {best && (
                <>
                  <Typography>
                    {rated.length} movie{rated.length === 1 ? "" : "s"} rated
                    {" · "}Avg{" "}
                    <Box
                      component="span"
                      sx={{ color: scoreColor(avg), fontWeight: "bolder" }}
                    >
                      {avg.toFixed(2)}
                    </Box>
                    {daniCount > 0 && ` · ${daniCount} Dani approved`}
                  </Typography>
                  <Typography>
                    Best: <MovieLink movie={best} />
                    {worst.tmdbid !== best.tmdbid && (
                      <>
                        {" · "}Worst: <MovieLink movie={worst} />
                      </>
                    )}
                  </Typography>
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <ScoreBars scores={rated.map((movie) => movie.jh_score)} />
                  </Box>
                </>
              )}
            </Stack>
          </Grid>
          {best && (
            <Grid
              size={12}
              sx={{
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
              }}
            >
              <ScoreBars scores={rated.map((movie) => movie.jh_score)} />
            </Grid>
          )}
          {bio && (
            <Grid size={12}>
              {bio.length > bioCollapseChars ? (
                <>
                  <Collapse in={expanded} collapsedSize={60}>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {bio}
                    </Typography>
                  </Collapse>
                  <Box
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: 1,
                      fontSize: "0.875rem",
                      color: "text.disabled",
                      "&:hover": { color: "secondary.main" },
                    }}
                  >
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    {expanded ? "Show less" : "Show more"}
                  </Box>
                </>
              ) : (
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {bio}
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Item>
      {directedSorted.length > 0 && (
        <PosterRow
          title={`Directed (${directedSorted.length})`}
          movies={directedSorted}
          priority
        />
      )}
      {actedSorted.length > 0 && (
        <PosterRow
          title={`Acted In (${actedSorted.length})`}
          movies={actedSorted}
          priority={directedSorted.length === 0}
        />
      )}
    </Layout>
  );
};

export default PersonPage;
