interface MovieListQuery {
  genre?: string[];
  universe?: string[];
  exclusive?: string[];
  studio?: string[];
  holiday?: string[];
  year?: string[];
  director?: string[];
  runtime?: number[];
  decade?: string[];
  provider?: string[];
}

interface MovieGetQuery {
  tmdbid?: number;
  title?: string;
  year?: string;
}

interface MovieListByIdQuery {
  tmdbid: number[];
}

interface MostRecentMovieQuery {
  count?: number;
}

interface Movie {
  movie: string;
  jh_score: number;
  universe?: string;
  sub_universe?: string;
  genre: string;
  genre_2?: string;
  holiday?: string;
  exclusive?: string;
  studio?: string;
  year: number;
  review?: string;
  ranking: string;
  dani_approved: boolean;
  plot: string;
  poster: string;
  actors: string;
  director: string;
  ratings: Rating[];
  boxoffice: string;
  rated: string;
  runtime: number;
  provider: Providers;
  budget: string;
  tmdbid: number;
  recommendations: number[];
  rottentomatoes: string;
  imdb: string;
  metacritic: string;
  trailer: string;
}

interface TMDBMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Rating {
  source: string;
  value: string;
}

interface Providers {
  link: string;
  rent: ProviderInfo[];
  flatrate: ProviderInfo[];
  buy: ProviderInfo[];
}

interface ProviderInfo {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}
