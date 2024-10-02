export type SearchResult = {
  aggs: {
    [key: string]: Record<string, number>;
  };
  total: {
    value: number;
    relation: string;
  };
  results:
    | RepublicSearchResultBody[]
    | TranslatinSearchResultsBody[]
    | MondriaanSearchResultsBody[]
    | GlobaliseSearchResultsBody[];
};

export interface RepublicSearchResultBody {
  _id: string;
  bodyType: string;
  sessionDate: string;
  document: string;
  sessionDay: number;
  sessionMonth: number;
  sessionYear: number;
  sessionWeekday: string;
  propositionType: string;
  resolutionType: string;
  textType: string;
  _hits: {
    text: string[];
  };
}

export type TranslatinSearchResultsBody = {
  _id: string;
  bodyType: string;
  earliest: string;
  expression: string;
  form: string;
  formType: string;
  genre: string;
  latest: string;
  latinTitle: string;
  manifestation: string;
  title: string;
  work: string;
  _hits: {
    text: string[];
  };
};

export type MondriaanSearchResultsBody = {
  _id: string;
  bodyType: string;
  correspondent: string;
  sender: string;
  period: string;
  type: string;
  _hits: {
    text: string[];
  };
};

export type VanGoghSearchResultsBody = {
  _id: string;
  correspondent: string;
  sender: string;
  institution: string;
  location: string;
  msid: string;
  period: string;
  _hits: {
    text: string[];
  };
};

export type GlobaliseSearchResultsBody = {
  _id: string;
  document: string;
  invNr: string;
  _hits: {
    text: string[];
  };
};

export type DefaultSearchResultsBody = {
  _id: string;
  _hits: {
    text: string[];
  };
};

export type SurianoSearchResultsBody = DefaultSearchResultsBody & {
  bodyType: string;
  date: string;
  recipient: string;
  recipientLoc: string;
  sender: string;
  senderLoc: string;
  shelfmark: string;
  summary: string;
  _hits: {
    summary: string[];
  };
};

export type FacetType = string | Record<string, string>;

export type FacetTypes = {
  [key: FacetName]: FacetType;
};

export type FacetName = string;
export type FacetOptionName = string;

/**
 * Facets and all facet options
 */
export type Facets = Record<FacetName, FlatFacet | NestedFacet>;

/**
 * Document count per facet option
 */
export type FlatFacet = Record<FacetOptionName, number>;

export type NestedFacet = Record<string, Record<string, number>>;

/**
 * Selected facet options per facet
 */
export type Terms = {
  [key: string]: FacetOptionName[] | Record<string, FacetOptionName[]>;
};

export type FlatTerms = FacetOptionName[];

export type NestedTerms = Record<string, FacetOptionName[]>;

export type Indices = {
  [key: string]: {
    [key: string]: string;
  };
};

export type SimpleAggregation = {
  order: string;
  size: number;
};

export type NestedAggregation = {
  [key: string]: SimpleAggregation;
};

export type Aggregation = SimpleAggregation | NestedAggregation;

export type Aggregations = {
  [key: string]: Aggregation;
};

export type SearchQueryRequestBody =
  | {
      text?: string;
      terms: Terms;
      aggs?: Aggregations;
      date?: {
        from: string;
        to: string;
        name: string;
      };
      range?: {
        from: string;
        to: string;
        name: string;
      };
    }
  | Record<string, never>;
export const ASC = "asc";
export const DESC = "desc";
export type SortOrder = "desc" | "asc";
