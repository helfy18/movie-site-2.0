// Writes public/robots.txt and public/sitemap.xml before `next build`, so
// neither needs a serverless function at request time. Mirrors sitemapPaths()
// in src/utils.ts (kept in TS for the unit tests); keep the two in step.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

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

const res = await fetch(`${APIURL}/movies/list?view=compact`);
if (!res.ok)
  throw new Error(`ratings API ${res.status} while building the sitemap`);
const movies = await res.json();

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
  `generate-static: robots.txt (${BLOCKED_BOTS.length} bots blocked), sitemap.xml (${paths.length} urls)`,
);
