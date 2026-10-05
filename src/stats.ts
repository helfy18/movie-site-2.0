import { toPosterMovie } from "@/utils";

export interface GroupStat {
  label: string;
  count: number;
  avg: number;
  query?: MovieListQuery;
}

export interface PersonStat {
  name: string;
  count: number;
  avg: number;
  // Filter value for links when it differs from the display name.
  filter?: string;
}

export interface PeopleLeaderboards {
  best: PersonStat[];
  worst: PersonStat[];
  mostWatched: PersonStat[];
}

export interface CriticGap {
  movie: string;
  tmdbid: number;
  mine: number;
  theirs: number;
}

export interface CriticSite {
  site: string;
  higher: CriticGap[];
  lower: CriticGap[];
}

export interface DaniStats {
  count: number;
  avgApproved: number;
  avgRest: number;
  topGenre: { label: string; rate: number } | null;
}

export interface YearBest {
  year: number;
  movie: PosterMovie;
}

export interface SiteStats {
  movieCount: number;
  runtimeDays: number;
  avgScore: number;
  medianScore: number;
  perfectScores: number;
  distribution: number[];
  decades: GroupStat[];
  genres: GroupStat[];
  directors: PeopleLeaderboards;
  actors: PeopleLeaderboards;
  subUniverses: PeopleLeaderboards;
  critics: CriticSite[];
  dani: DaniStats;
  bestByYear: YearBest[];
}

export const BUCKET_SIZE = 5;
export const BUCKET_COUNT = 100 / BUCKET_SIZE;
export const MIN_DIRECTOR_MOVIES = 3;
export const MIN_ACTOR_MOVIES = 5;
export const TOP_BILLING = 10;
export const GENRE_LIMIT = 20;
export const MIN_SUB_UNIVERSE_MOVIES = 3;
const CRITIC_GAP_SIZE = 10;
const DANI_GENRE_MIN = 20;
const LEADERBOARD_SIZE = 10;

interface Tally {
  count: number;
  sum: number;
}

const tallyInto = (tallies: Map<string, Tally>, key: string, score: number) => {
  const tally = tallies.get(key) ?? { count: 0, sum: 0 };
  tally.count += 1;
  tally.sum += score;
  tallies.set(key, tally);
};

const toGroupStats = (tallies: Map<string, Tally>): GroupStat[] =>
  [...tallies].map(([label, { count, sum }]) => ({
    label,
    count,
    avg: sum / count,
  }));

const qualify = (tallies: Map<string, Tally>, minCount: number): PersonStat[] =>
  [...tallies]
    .filter(([, { count }]) => count >= minCount)
    .map(([name, { count, sum }]) => ({ name, count, avg: sum / count }));

// For actors the tallies differ: avg uses top-billed roles, count uses all.
const toLeaderboards = (
  avgTallies: Map<string, Tally>,
  countTallies: Map<string, Tally>,
  minCount: number,
): PeopleLeaderboards => {
  const byAvg = qualify(avgTallies, minCount).sort(
    (a, b) => b.avg - a.avg || b.count - a.count,
  );
  const byCount = qualify(countTallies, minCount).sort(
    (a, b) => b.count - a.count || b.avg - a.avg,
  );
  return {
    best: byAvg.slice(0, LEADERBOARD_SIZE),
    worst: byAvg.slice(-LEADERBOARD_SIZE).reverse(),
    mostWatched: byCount.slice(0, LEADERBOARD_SIZE),
  };
};

const parseScore = (value: string | undefined, pattern: RegExp, scale = 1) => {
  const match = value?.match(pattern);
  return match ? Math.round(parseFloat(match[1]) * scale) : null;
};

const criticSites = [
  {
    site: "IMDb",
    score: (m: Movie) => parseScore(m.imdb, /^([\d.]+)\/10$/, 10),
  },
  {
    site: "Rotten Tomatoes",
    score: (m: Movie) => parseScore(m.rottentomatoes, /^(\d+)%$/),
  },
  {
    site: "Metacritic",
    score: (m: Movie) => parseScore(m.metacritic, /^(\d+)\/100$/),
  },
];

const buildCritics = (catalogue: Movie[]): CriticSite[] =>
  criticSites.map(({ site, score }) => {
    const gaps: CriticGap[] = catalogue.flatMap((m) => {
      const theirs = score(m);
      if (theirs === null) return [];
      return [{ movie: m.movie, tmdbid: m.tmdbid, mine: m.jh_score, theirs }];
    });
    gaps.sort((a, b) => b.mine - b.theirs - (a.mine - a.theirs));
    return {
      site,
      higher: gaps.slice(0, CRITIC_GAP_SIZE),
      lower: gaps.slice(-CRITIC_GAP_SIZE).reverse(),
    };
  });

const average = (movies: Movie[]) =>
  movies.length
    ? movies.reduce((sum, m) => sum + m.jh_score, 0) / movies.length
    : 0;

const buildDani = (catalogue: Movie[]): DaniStats => {
  const approved = catalogue.filter((m) => m.dani_approved);
  const rest = catalogue.filter((m) => !m.dani_approved);
  const genreCounts = new Map<string, { total: number; approved: number }>();
  for (const m of catalogue) {
    for (const genre of [m.genre, m.genre_2]) {
      if (!genre) continue;
      const entry = genreCounts.get(genre) ?? { total: 0, approved: 0 };
      entry.total += 1;
      if (m.dani_approved) entry.approved += 1;
      genreCounts.set(genre, entry);
    }
  }
  let topGenre: DaniStats["topGenre"] = null;
  for (const [label, { total, approved: count }] of genreCounts) {
    if (total < DANI_GENRE_MIN) continue;
    const rate = count / total;
    if (!topGenre || rate > topGenre.rate) topGenre = { label, rate };
  }
  return {
    count: approved.length,
    avgApproved: average(approved),
    avgRest: average(rest),
    topGenre,
  };
};

const buildBestByYear = (catalogue: Movie[]): YearBest[] => {
  const byYear = new Map<number, Movie>();
  for (const m of catalogue) {
    const current = byYear.get(m.year);
    if (
      !current ||
      m.jh_score > current.jh_score ||
      (m.jh_score === current.jh_score &&
        Number(m.ranking) < Number(current.ranking))
    ) {
      byYear.set(m.year, m);
    }
  }
  return [...byYear]
    .sort(([a], [b]) => b - a)
    .map(([year, movie]) => ({ year, movie: toPosterMovie(movie) }));
};

const median = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const capGenres = (genreStats: GroupStat[]): GroupStat[] => {
  const top = genreStats.slice(0, GENRE_LIMIT);
  const rest = genreStats.slice(GENRE_LIMIT);
  if (rest.length === 0) return top;
  const count = rest.reduce((s, g) => s + g.count, 0);
  const sum = rest.reduce((s, g) => s + g.avg * g.count, 0);
  return [...top, { label: "Other", count, avg: sum / count }];
};

const labelSubUniverses = (
  boards: PeopleLeaderboards,
  parents: Map<string, string>,
): PeopleLeaderboards => {
  const label = (p: PersonStat): PersonStat => {
    const parent = parents.get(p.name);
    return {
      ...p,
      name: parent ? `${parent} - ${p.name}` : p.name,
      filter: p.name,
    };
  };
  return {
    best: boards.best.map(label),
    worst: boards.worst.map(label),
    mostWatched: boards.mostWatched.map(label),
  };
};

export const buildStats = (catalogue: Movie[]): SiteStats => {
  const distribution = Array<number>(BUCKET_COUNT).fill(0);
  const decades = new Map<string, Tally>();
  const genres = new Map<string, Tally>();
  const directors = new Map<string, Tally>();
  const actors = new Map<string, Tally>();
  const topBilledActors = new Map<string, Tally>();
  const subUniverses = new Map<string, Tally>();
  const subUniverseParents = new Map<string, string>();
  let runtimeMinutes = 0;
  let scoreSum = 0;

  for (const movie of catalogue) {
    const score = movie.jh_score;
    scoreSum += score;
    runtimeMinutes += movie.runtime;
    distribution[Math.min(BUCKET_COUNT - 1, Math.floor(score / BUCKET_SIZE))]++;
    tallyInto(decades, `${Math.floor(movie.year / 10) * 10}s`, score);
    for (const genre of [movie.genre, movie.genre_2]) {
      if (genre) tallyInto(genres, genre, score);
    }
    if (movie.sub_universe) {
      tallyInto(subUniverses, movie.sub_universe, score);
      if (movie.universe)
        subUniverseParents.set(movie.sub_universe, movie.universe);
    }
    for (const name of movie.directors ?? []) tallyInto(directors, name, score);
    (movie.cast ?? []).forEach((name, billing) => {
      tallyInto(actors, name, score);
      if (billing < TOP_BILLING) tallyInto(topBilledActors, name, score);
    });
  }

  return {
    movieCount: catalogue.length,
    runtimeDays: Math.round((runtimeMinutes / 60 / 24) * 10) / 10,
    avgScore: catalogue.length ? scoreSum / catalogue.length : 0,
    medianScore: median(catalogue.map((m) => m.jh_score)),
    perfectScores: catalogue.filter((m) => m.jh_score === 100).length,
    distribution,
    decades: toGroupStats(decades)
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((g) => {
        const start = parseInt(g.label, 10);
        return { ...g, query: { decade: [`${start}-${start + 9}`] } };
      }),
    genres: capGenres(
      toGroupStats(genres)
        .sort((a, b) => b.count - a.count || b.avg - a.avg)
        .map((g) => ({ ...g, query: { genre: [g.label] } })),
    ),
    directors: toLeaderboards(directors, directors, MIN_DIRECTOR_MOVIES),
    actors: toLeaderboards(topBilledActors, actors, MIN_ACTOR_MOVIES),
    subUniverses: labelSubUniverses(
      toLeaderboards(subUniverses, subUniverses, MIN_SUB_UNIVERSE_MOVIES),
      subUniverseParents,
    ),
    critics: buildCritics(catalogue),
    dani: buildDani(catalogue),
    bestByYear: buildBestByYear(catalogue),
  };
};
