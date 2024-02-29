import { StateCreator } from "zustand";
import {
  FacetNamesByType,
  Facet,
  FacetName,
  Facets,
  SearchQueryRequestBody,
  Terms,
  FacetType,
} from "../../model/Search.ts";

/**
 * Parameters used to generate a search request body
 */
export type SearchQuery = {
  dateFacet?: FacetName;
  dateFrom: string;
  dateTo: string;
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
    dateFacet: undefined,
    dateFrom: "",
    dateTo: "",
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

export type FacetEntry = [FacetName, Facet];

export function filterFacetsByType(
  facetByType: FacetNamesByType,
  facets: Facets,
  type: FacetType,
): FacetEntry[] {
  if (!facets || !facetByType) {
    return [];
  }
  return Object.entries(facets).filter(([name]) => {
    return facetByType[name] === type;
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

  return searchQuery;
}
