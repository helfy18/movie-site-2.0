// Writes public/robots.txt and public/sitemap.xml before `next build`, so
// neither needs a serverless function at request time. Mirrors sitemapPaths()
// in src/utils.ts (kept in TS for the unit tests); keep the two in step.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

for (const file of [".env.production", ".env.local"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line
      .replace(/^\uFEFF/, "")
      .match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env))
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const SITEURL = process.env.NEXT_PUBLIC_SITEURL ?? "http://localhost:3000";
const APIURL = process.env.NEXT_PUBLIC_APIURL ?? "http://localhost:8080";
const MIN_SITEMAP_APPEARANCES = 5; // keep in step with src/utils.ts

// Crawlers that scrape for training data or hammer the site without sending
// visitors. Each page they fetch after its cache expires costs a function call.
const BLOCKED_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "FacebookBot",
  "PerplexityBot",
  "Applebot-Extended",
  "Google-Extended",
  "cohere-ai",
  "Diffbot",
  "PetalBot",
  "YandexBot",
  "SemrushBot",
  "AhrefsBot",
  "MJ12bot",
  "DotBot",
];

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /movie-page",
  "Disallow: /movie-shell/",
  "Disallow: /person-shell/",
  "Disallow: /find",
  "",
  ...BLOCKED_BOTS.flatMap((bot) => [`User-agent: ${bot}`, "Disallow: /", ""]),
  `Sitemap: ${SITEURL}/sitemap.xml`,
  "",
].join("\n");
writeFileSync("public/robots.txt", robots);

// The full catalogue, fetched one decade at a time. A single request for all
// of it can outrun the API host's gateway timeout when the API is slow; the
// pieces are small enough to always get through. Pages that need the whole
// catalogue (home, stats) read .cache/catalogue.json instead of the API.
const getJson = async (url, attempts = 4) => {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
      if (res.status < 500 || attempt >= attempts)
        throw new Error(`${res.status} from ${url}`);
    } catch (error) {
      if (attempt >= attempts) throw error;
    }
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
};

const expected = await getJson(`${APIURL}/movies/count`);
const thisDecade = Math.floor(new Date().getFullYear() / 10) * 10;
const movies = [];
for (let start = 1900; start <= thisDecade; start += 10) {
  const chunk = await getJson(
    `${APIURL}/movies/list?decade=${start}-${start + 9}`,
  );
  movies.push(...chunk);
  console.log(`generate-static: ${start}s ${chunk.length} movies`);
}
movies.sort((a, b) => Number(a.ranking) - Number(b.ranking));
if (movies.length !== expected)
  console.warn(
    `generate-static: fetched ${movies.length} movies but the API counts ${expected}`,
  );
mkdirSync(".cache", { recursive: true });
writeFileSync(".cache/catalogue.json", JSON.stringify(movies));

// The grid's unfiltered list, served from the CDN instead of the API on
// every visit: the fields the grid renders and searches, cast as names only.
const compact = movies.map((m) => ({
  movie: m.movie,
  jh_score: m.jh_score,
  poster: m.poster,
  tmdbid: m.tmdbid,
  dani_approved: m.dani_approved,
  cast: (m.cast ?? []).map((c) => ({ name: c.name })),
  directors: m.directors ?? [],
  universe: m.universe ?? "",
  sub_universe: m.sub_universe ?? "",
  studio: m.studio ?? "",
  year: m.year,
}));
mkdirSync("public/data", { recursive: true });
writeFileSync("public/data/movies.json", JSON.stringify(compact));

const appearances = new Map();
for (const movie of movies) {
  const names = new Set([
    ...(movie.cast ?? []).map((c) => c.name),
    ...(movie.directors ?? []),
  ]);
  for (const name of names)
    appearances.set(name, (appearances.get(name) ?? 0) + 1);
}
const paths = [
  "",
  "/movie-grid",
  "/random-movie",
  "/stats",
  "/about",
  ...movies.map((m) => `/movie/${m.tmdbid}`),
  ...[...appearances]
    .filter(([, n]) => n >= MIN_SITEMAP_APPEARANCES)
    .map(([name]) => `/person/${encodeURIComponent(name)}`),
].map((p) => (p ? `${p}/` : p)); // trailingSlash: true
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITEURL}${p}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync("public/sitemap.xml", xml);
console.log(
  `generate-static: robots.txt (${BLOCKED_BOTS.length} bots blocked), sitemap.xml (${paths.length} urls), catalogue (${movies.length} movies)`,
);
