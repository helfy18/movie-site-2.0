# JD Movies

A personal movie ratings site. Browse every movie I've rated, filter by genre, universe, director, streaming provider and more, see what's playing in theatres, or get a random pick. Every actor and director links to a person page with their stats and filmography, and the stats page charts the whole catalogue: score distribution, decades, genres, leaderboards, where my ratings disagree with critics, and the best movie of each year.

Built with Next.js (pages router), React Query, MUI and Tailwind. Movie data comes from a separate ratings API, with posters, provider availability and theatre listings from [TMDB](https://www.themoviedb.org/) and [JustWatch](https://www.justwatch.com/).

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable              | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_APIURL`  | Base URL of the ratings API                        |
| `NEXT_PUBLIC_TMDBKEY` | TMDB v3 API key, used for now-playing and upcoming |

Put local overrides in `.env.local`, which is git-ignored. `.env.production` holds the deployed values.

## Scripts

| Script              | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Development server with hot reload |
| `npm run build`     | Production build                   |
| `npm run start`     | Serve the production build         |
| `npm run lint`      | ESLint over the whole project      |
| `npm run typecheck` | TypeScript type check              |
| `npm test`          | Unit tests (Vitest)                |

## Layout

```
src/
  pages/        one file per route
  components/   shared UI
  api/          fetch client, React Query provider and hooks
  interfaces/   global TypeScript types for API data
  styles/       theme tokens, MUI theme, Tailwind globals
  __tests__/    unit tests (Vitest)
  homeRows.ts   home-page poster row building
  stats.ts      stats-page aggregation
  utils.ts      URL helpers and poster-shape builders
```
