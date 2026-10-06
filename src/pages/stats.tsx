import Layout from "@/components/layout";
import { fetchMoviesList, hasServerResponse } from "@/api/client";
import {
  buildStats,
  MIN_ACTOR_MOVIES,
  MIN_DIRECTOR_MOVIES,
  MIN_SUB_UNIVERSE_MOVIES,
  TOP_BILLING,
  type CriticGap,
  type PersonStat,
  type SiteStats,
} from "@/stats";
import { Box, Grid, Stack, Typography } from "@mui/material";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Item } from "@/components/item";
import { Poster } from "@/components/posterRow";
import { CountBars, ScoreHistogram } from "@/components/statCharts";
import { scoreColor } from "@/styles/gradient";
import { gridLink, personLink } from "@/utils";

interface Props {
  stats: SiteStats;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  let catalogue: Movie[];
  try {
    catalogue = await fetchMoviesList({});
  } catch (error) {
    if (hasServerResponse(error)) return { notFound: true, revalidate: 60 };
    throw error;
  }
  if (catalogue.length === 0) return { notFound: true, revalidate: 60 };

  return { props: { stats: buildStats(catalogue) }, revalidate: 3600 };
};

const HeroTile = ({
  value,
  label,
  color,
  query,
  size = { xs: 6, md: 2.4 },
}: {
  value: string;
  label: string;
  color?: string;
  query?: MovieListQuery;
  size?: { xs: number; md: number };
}) => {
  const tile = (
    <Item
      sx={{
        textAlign: "center",
        color: "secondary.main",
        height: "100%",
        ...(query ? { "&:hover": { opacity: 0.8 } } : {}),
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
        {value}
      </Typography>
      <Typography variant="body2">{label}</Typography>
    </Item>
  );
  return (
    <Grid size={size}>
      {query ? <Link href={gridLink(query)}>{tile}</Link> : tile}
    </Grid>
  );
};

const Section = ({
  title,
  children,
  fullHeight,
}: {
  title: string;
  children: React.ReactNode;
  fullHeight?: boolean;
}) => (
  <Box
    sx={
      fullHeight
        ? { mt: 3, height: "100%", display: "flex", flexDirection: "column" }
        : { mt: 3 }
    }
  >
    <header className="w-full font-bold text-xl my-2">{title}</header>
    {children}
  </Box>
);

const LeaderList = ({
  title,
  people,
  linkFor = personLink,
}: {
  title: string;
  people: PersonStat[];
  linkFor?: (name: string) => React.ComponentProps<typeof Link>["href"];
}) => (
  <Grid size={{ xs: 12, md: 4 }}>
    <Item sx={{ color: "secondary.main", height: "100%" }}>
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>{title}</Typography>
      <Stack spacing={0.75}>
        {people.map((person, index) => (
          <Box
            key={person.name}
            sx={{ display: "flex", gap: 1, alignItems: "baseline" }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {index + 1}.
            </Typography>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Link
                href={linkFor(person.filter ?? person.name)}
                className="underline"
                title={person.name}
              >
                {person.name}
              </Link>
            </Box>
            <Box
              component="span"
              sx={{ color: scoreColor(person.avg), fontWeight: "bolder" }}
            >
              {person.avg.toFixed(2)}
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
            >
              ({person.count})
            </Typography>
          </Box>
        ))}
      </Stack>
    </Item>
  </Grid>
);

const CriticColumn = ({ site, gaps }: { site: string; gaps: CriticGap[] }) => (
  <Grid size={{ xs: 12, md: 4 }}>
    <Item sx={{ color: "secondary.main", height: "100%" }}>
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>{site}</Typography>
      <Stack spacing={0.75}>
        {gaps.map((gap, index) => (
          <Box
            key={gap.tmdbid}
            sx={{ display: "flex", gap: 1, alignItems: "baseline" }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {index + 1}.
            </Typography>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Link
                href={`/movie/${gap.tmdbid}`}
                className="underline"
                title={gap.movie}
              >
                {gap.movie}
              </Link>
            </Box>
            <Box
              component="span"
              sx={{ color: scoreColor(gap.mine), fontWeight: "bolder" }}
            >
              {gap.mine}
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
            >
              vs {gap.theirs}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Item>
  </Grid>
);

const StatsPage = ({ stats }: Props) => (
  <Layout pageTitle="Stats">
    <Head>
      <meta name="description" content="Stats across every movie rated" />
    </Head>
    <Grid container spacing={2}>
      <HeroTile
        value={String(stats.movieCount)}
        label="movies rated"
        query={{}}
      />
      <HeroTile value={`${stats.runtimeDays}`} label="days of watching" />
      <HeroTile
        value={stats.avgScore.toFixed(2)}
        label="average score"
        color={scoreColor(stats.avgScore)}
      />
      <HeroTile
        value={String(stats.medianScore)}
        label="median score"
        color={scoreColor(stats.medianScore)}
      />
      <HeroTile
        value={String(stats.perfectScores)}
        label="perfect 100s"
        query={{ rating: [100, 100] }}
      />
    </Grid>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Section title="By Score" fullHeight>
          <Item
            sx={{
              color: "secondary.main",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScoreHistogram counts={stats.distribution} />
          </Item>
        </Section>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Section title="By Decade" fullHeight>
          <Item
            sx={{
              color: "secondary.main",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CountBars data={stats.decades} columnWidth={{ xs: 32, md: 38 }} />
          </Item>
        </Section>
      </Grid>
    </Grid>
    <Section title="By Genre">
      <Item sx={{ color: "secondary.main" }}>
        <CountBars data={stats.genres} />
      </Item>
    </Section>
    <Section title="Dani Approved">
      <Grid container spacing={2}>
        <HeroTile
          value={String(stats.dani.count)}
          label="movies approved"
          query={{ dani_approved: true }}
          size={{ xs: 12, md: 4 }}
        />
        <HeroTile
          value={`${stats.dani.avgApproved.toFixed(2)} vs ${stats.dani.avgRest.toFixed(2)}`}
          label="approved avg vs the rest"
          color={scoreColor(stats.dani.avgApproved)}
          size={{ xs: 12, md: 4 }}
        />
        {stats.dani.topGenre && (
          <HeroTile
            value={stats.dani.topGenre.label}
            label={`most approved genre (${Math.round(stats.dani.topGenre.rate * 100)}%)`}
            query={{ genre: [stats.dani.topGenre.label] }}
            size={{ xs: 12, md: 4 }}
          />
        )}
      </Grid>
    </Section>
    <Section title={`Directors (min ${MIN_DIRECTOR_MOVIES} movies)`}>
      <Grid container spacing={2}>
        <LeaderList title="Highest Average" people={stats.directors.best} />
        <LeaderList title="Lowest Average" people={stats.directors.worst} />
        <LeaderList title="Most Watched" people={stats.directors.mostWatched} />
      </Grid>
    </Section>
    <Section
      title={`Actors (min ${MIN_ACTOR_MOVIES} movies · averages count top-${TOP_BILLING} billing only)`}
    >
      <Grid container spacing={2}>
        <LeaderList title="Highest Average" people={stats.actors.best} />
        <LeaderList title="Lowest Average" people={stats.actors.worst} />
        <LeaderList title="Most Watched" people={stats.actors.mostWatched} />
      </Grid>
    </Section>
    <Section title={`Universes (min ${MIN_SUB_UNIVERSE_MOVIES} movies)`}>
      <Grid container spacing={2}>
        <LeaderList
          title="Highest Average"
          people={stats.subUniverses.best}
          linkFor={(name) => gridLink({ universe: [name] })}
        />
        <LeaderList
          title="Lowest Average"
          people={stats.subUniverses.worst}
          linkFor={(name) => gridLink({ universe: [name] })}
        />
        <LeaderList
          title="Most Movies"
          people={stats.subUniverses.mostWatched}
          linkFor={(name) => gridLink({ universe: [name] })}
        />
      </Grid>
    </Section>
    <Section title="Critics Disagreement">
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>I Liked More</Typography>
      <Grid container spacing={2}>
        {stats.critics.map(({ site, higher }) => (
          <CriticColumn key={site} site={site} gaps={higher} />
        ))}
      </Grid>
      <Typography sx={{ fontWeight: "bold", mb: 1, mt: 2 }}>
        Critics Liked More
      </Typography>
      <Grid container spacing={2}>
        {stats.critics.map(({ site, lower }) => (
          <CriticColumn key={site} site={site} gaps={lower} />
        ))}
      </Grid>
    </Section>
    <Section title="Best of Each Year">
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
        {stats.bestByYear.map(({ year, movie }) => (
          <Box key={year} sx={{ textAlign: "center", flexShrink: 0 }}>
            <Typography sx={{ fontWeight: "bold", mb: 0.5 }}>{year}</Typography>
            <Link
              href={`/movie/${movie.tmdbid}`}
              style={{ textDecoration: "none" }}
            >
              <Poster movie={movie} isLink />
            </Link>
          </Box>
        ))}
      </Box>
    </Section>
  </Layout>
);

export default StatsPage;
