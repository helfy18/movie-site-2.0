interface MovieListQuery {
  genre?: string[];
  universe?: string[];
  exclusive?: string[];
  studio?: string[];
  holiday?: string[];
  year?: number[];
  director?: string[];
  runtime?: number[];
}

interface MovieGetQuery {
  tmdbid?: number;
  title?: string;
  year?: string;
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
