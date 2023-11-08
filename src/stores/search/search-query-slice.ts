import {StateCreator} from "zustand";
import {EsIndex, Facet, Facets, SearchQueryRequestBody, Terms} from "../../model/Search.ts";

/**
 * Parameters used to generate a search request body
 */
export type SearchQuery = {
  dateFrom: string;
  dateTo: string;
  index: EsIndex
  fullText: string;
  terms: Terms
};

export type SearchQuerySlice = {
  searchQuery: SearchQuery;
  queryHistory: SearchQuery[];
  setSearchQuery: (update: SearchQuery) => void;
  updateSearchQueryHistory: (update: SearchQuery) => void;
};

export const createSearchQuerySlice: StateCreator<
    SearchQuerySlice, [], [], SearchQuerySlice
> = (set) => ({
  searchQuery: {
    dateFrom: "",
    dateTo: "",
    index: {},
    fullText: "",
    terms: {}
  } as SearchQuery,
  queryHistory: [],
  setSearchQuery: update => set((prev) => ({
    ...prev,
    searchQuery: update
  })),
  updateSearchQueryHistory: (update: SearchQuery) =>  set(prev => ({
    ...prev,
    queryHistory: [...prev.queryHistory, update]
  }))
});

/**
 * Generate search query request body from search query parameters
 */
export function queryBodySelector(state: SearchQuerySlice): SearchQueryRequestBody {
  return createSearchQueryRquestBody(state.searchQuery);
}

export const searchHistorySelector = (
    state: SearchQuerySlice
): SearchQueryRequestBody[] => {
  return state.queryHistory.map(params => createSearchQueryRquestBody(params));
}

export const filterFacetByTypeSelector = (state: SearchQuerySlice) => (
    facets: Facets,
    type: "keyword" | "date",
): [string, Facet][] => {
  if(!facets) {
    return [];
  }
  return Object.entries(facets).filter(([key]) => {
    return state.searchQuery?.index[key] === type;
  });
}

export function createSearchQueryRquestBody(
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

  searchQuery.date = {
    name: "sessionDate",
    from: query.dateFrom,
    to: query.dateTo,
  };

  return searchQuery;
}
