interface AllType {
  director: FilterType[];
  exclusive: string[];
  genre: FilterType[];
  holiday: string[];
  runtime: Runtime[];
  provider: ProviderInfo[];
  studio: string[];
  universes: Universe[];
  year: number[];
  score?: number[];
}

interface FilterType {
  fieldValue: string;
  totalCount: number;
}

interface Universe {
  fieldValue: string;
  noSubUniverseCount: number;
  subUniverses: FilterType[];
  totalCount: number;
  _id: string;
}

interface Runtime {
  min: number;
  max: number;
}
