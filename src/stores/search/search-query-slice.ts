import { StateCreator } from "zustand";
import {
  Aggregations,
  FacetName,
  FacetTypes,
  Facets,
  FlatFacet,
  NestedFacet,
  SearchQueryRequestBody,
  Terms,
} from "../../model/Search.ts";

/**
 * Parameters used to generate a search request body
 */
export type SearchQuery = {
  dateFacet?: FacetName;
  rangeFacet?: FacetName;
  aggs?: Aggregations[];
  dateFrom: string;
  dateTo: string;
  rangeFrom: string;
  rangeTo: string;
  fullText: string;
  terms: Terms;
};

export type SearchQuerySlice = {
  searchQuery: SearchQuery;
  searchQueryHistory: SearchQuery[];
  setSearchQuery: (update: SearchQuery) => void;
  updateSearchQueryHistory: (update: SearchQuery) => void;
};

export const createSearchQuerySlice: StateCreator<
  SearchQuerySlice,
  [],
  [],
  SearchQuerySlice
> = (set) => ({
  searchQuery: {
    dateFrom: "",
    dateTo: "",
    rangeFrom: "",
    rangeTo: "",
    fullText: "",
    terms: {},
  },
  searchQueryHistory: [],
  setSearchQuery: (update) =>
    set((prev) => ({
      ...prev,
      searchQuery: update,
    })),
  updateSearchQueryHistory: (update: SearchQuery) =>
    set((prev) => ({
      ...prev,
      searchQueryHistory: [...prev.searchQueryHistory, update],
    })),
});

export type FacetEntry = {
  type: "flat" | "nested";
  facetName: FacetName;
  facetItems: FlatFacet | NestedFacet;
};

export function filterFacetsByType(
  facetTypes: FacetTypes,
  facets: Facets,
  type: string,
): FacetEntry[] {
  if (!facets || !facetTypes) {
    return [];
  }
  return Object.entries(facets)
    .filter(([name]) => {
      return facetTypes[name] === type;
    })
    .map(([facetName, facetItems]) => {
      return {
        type: "flat",
        facetName: facetName,
        facetItems: facetItems,
      };
    });
}

export function toRequestBody(query: SearchQuery): SearchQueryRequestBody {
  if (!query?.terms) {
    return {};
  }
  const searchQuery = {} as SearchQueryRequestBody;
  const fullText = query.fullText;

  if (fullText) {
    searchQuery.text = fullText;
  }

  searchQuery.terms = query.terms;

  if (query.dateFacet) {
    searchQuery.date = {
      name: query.dateFacet,
      from: query.dateFrom,
      to: query.dateTo,
    };
  }

  if (query.rangeFacet) {
    searchQuery.range = {
      name: query.rangeFacet,
      from: query.rangeFrom,
      to: query.rangeTo,
    };
  }

  if (query.aggs) {
    searchQuery.aggs = query.aggs?.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
  }

  return searchQuery;
}
