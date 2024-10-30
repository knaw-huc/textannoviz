import { StateCreator } from "zustand";
import {
  Facet,
  FacetName,
  FacetTypes,
  FacetType,
  Facets,
  SearchQueryRequestBody,
  Terms,
} from "../../model/Search.ts";

/**
 * Parameters used to generate a search request body
 */
export type SearchQuery = {
  dateFacet?: FacetName;
  rangeFacet?: FacetName;
  aggs?: {
    facetName: string;
    order: string;
    size: number;
  }[];
  dateFrom: string;
  dateTo: string;
  rangeFrom: string;
  rangeTo: string;
  fullText: string;
  terms: Terms;
};

export type SearchQuerySlice = {
  searchQuery: SearchQuery;
  setSearchQuery: (update: SearchQuery) => void;
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
  setSearchQuery: (update) =>
    set((prev) => ({
      ...prev,
      searchQuery: update,
    })),
});

export type FacetEntry = [FacetName, Facet];

export function filterFacetsByType(
  facetTypes: FacetTypes,
  facets: Facets,
  type: FacetType,
): FacetEntry[] {
  if (!facets || !facetTypes) {
    return [];
  }
  return Object.entries(facets).filter(([name]) => {
    return facetTypes[name] === type;
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
    searchQuery.aggs = query.aggs.map(
      (agg) => `${agg.facetName}:${agg.order},${agg.size}`,
    );
  }

  return searchQuery;
}
