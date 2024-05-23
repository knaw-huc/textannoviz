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

export type FacetType = "date" | "keyword" | "short";

export type FacetNamesByType = {
  [key: FacetName]: FacetType;
};

export type FacetName = string;
export type FacetOptionName = string;

/**
 * Facets and all facet options
 */
export type Facets = Record<FacetName, Facet>;

/**
 * Document count per facet option
 */
export type Facet = Record<FacetOptionName, number>;

/**
 * Selected facet options per facet
 */
export type Terms = Record<FacetName, FacetOptionName[]>;

export type SearchQueryRequestBody =
  | {
      text?: string;
      terms: Terms;
      aggs?: string[];
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
