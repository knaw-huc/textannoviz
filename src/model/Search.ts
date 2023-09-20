export type SearchResult = {
  aggs: {
    [key: string]: Record<string, number>;
  };
  total: {
    value: number;
    relation: string;
  };
  results: SearchResultBody[];
} | null;

export interface SearchResultBody {
  _id: string;
  bodyType: string;
  sessionDate: string;
  document: string;
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

export type Indices = {
  [key: string]: {
    [key: string]: string;
  };
};

export type FacetValue = Record<string, number>;

export type Facets = Record<string, FacetValue>;

export type SearchQuery =
  | {
      text?: string;
      terms: Record<string, string[]>;
      aggs?: string[];
      date?: {
        from: string;
        to: string;
        name: string;
      };
    }
  | Record<string, never>;
