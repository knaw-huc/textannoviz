import {StateCreator} from "zustand";
import {
  FacetNamesByType,
  Facet,
  FacetName,
  Facets,
  SearchQueryRequestBody,
  Terms,
  FacetType
} from "../../model/Search.ts";

/**
 * Parameters used to generate a search request body
 */
export type SearchQuery = {
  dateFacet: FacetName | false;
  dateFrom: string;
  dateTo: string;
  index: FacetNamesByType
  fullText: string;
  terms: Terms
};

export type SearchQuerySlice = {
  searchQuery: SearchQuery;
  searchQueryHistory: SearchQuery[];
  setSearchQuery: (update: SearchQuery) => void;
  updateSearchQueryHistory: (update: SearchQuery) => void;
};

export const createSearchQuerySlice: StateCreator<
    SearchQuerySlice, [], [], SearchQuerySlice
> = (set) => ({
  searchQuery: {
    dateFacet: false,
    dateFrom: "",
    dateTo: "",
    index: {},
    fullText: "",
    terms: {}
  },
  searchQueryHistory: [],
  setSearchQuery: update => set((prev) => ({
    ...prev,
    searchQuery: update
  })),
  updateSearchQueryHistory: (update: SearchQuery) =>  set(prev => ({
    ...prev,
    searchQueryHistory: [...prev.searchQueryHistory, update]
  }))
});

export const filterFacetByTypeSelector = (
    state: SearchQuerySlice
) => (
    facets: Facets,
    type: FacetType
) => {
  return filterFacetsByType(state.searchQuery.index, facets, type);
}
export function filterFacetsByType(
    facetNamesByType: FacetNamesByType,
    facets: Facets,
    type: FacetType,
): [string, Facet][] {
  if(!facets || !facetNamesByType) {
    return [];
  }
  return Object.entries(facets).filter(([name]) => {
    return facetNamesByType[name] === type;
  });
}

export function toRequestBody(
    query: SearchQuery,
): SearchQueryRequestBody {
  if (!query || !query.index || !query.terms) {
    return {};
  }
  const searchQuery = {} as SearchQueryRequestBody;
  const fullText = query.fullText;

  if (fullText) {
    searchQuery.text = fullText;
  }

  searchQuery.terms = query.terms;

  if(query.dateFacet) {
    searchQuery.date = {
      name: query.dateFacet,
      from: query.dateFrom,
      to: query.dateTo,
    };
  }

  return searchQuery;
}
