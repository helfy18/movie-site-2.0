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
  rating?: number[];
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

// The subset of Movie that poster tiles render. Home-page props are trimmed
// to this shape to keep the serialized page data small.
interface PosterMovie {
  movie: string;
  jh_score: number;
  poster: string;
  tmdbid: number;
  dani_approved: boolean;
}

interface Movie extends PosterMovie {
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
  plot: string;
  actors: string;
  director: string;
  ratings: Rating[];
  boxoffice: string;
  rated: string;
  runtime: number;
  provider: Providers;
  budget: string;
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
  poster_path: string | null;
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
  ads?: ProviderInfo[] | null;
  free?: ProviderInfo[] | null;
}

interface ProviderInfo {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}
