interface MovieListQuery {
  genre?: string[];
  universe?: string[];
  exclusive?: string[];
  studio?: string[];
  holiday?: string[];
  year?: string[];
  director?: string[];
  runtime?: string[];
}

interface MovieGetQuery {
  tmdbid?: number;
  title?: string;
  year?: string;
}
