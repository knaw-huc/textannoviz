export interface SearchResult {
  total: {
    value: number;
    relation: string;
  };
  results: SearchResultBody[];
}

export interface SearchResultBody {
  _id: string;
  bodyType: string;
  sessionDate: string;
  sessionDay: number;
  sessionMonth: number;
  sessionYear: number;
  sessionWeekday: string;
  propositionType: string;
  _hits: {
    preview: string;
    locations: {
      start: {
        line: number;
        offset: number;
      };
      end: {
        line: number;
        offset: number;
      };
    }[];
  }[];
}

export interface Indices {
  [key: string]: {
    [key: string]: string;
  };
}

export interface FacetValue {
  [key: string]: number;
}

export interface Facets {
  [key: string]: FacetValue;
}

export type SearchQuery =
  | {
      text?: string;
      terms: {
        [key: string]: string[];
      };
      aggs?: string[];
      date?: {
        from: string;
        to: string;
        name: string;
      };
    }
  | Record<string, never>;
