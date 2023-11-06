import {StateCreator} from "zustand";
import {EsIndex, Facets, Facet, SearchQueryBody, Terms} from "../../model/Search.ts";

export type SearchQueryParams = {
  dateFrom: string;
  dateTo: string;
  index: EsIndex
  fullText: string;
  selectedFacets: Terms
};

export type SearchQuerySlice = {
  query: SearchQueryParams;
  queryHistory: SearchQueryParams[];
  setQuery: (update: SearchQueryParams) => void;
};

export const createSearchQuerySlice: StateCreator<
    SearchQuerySlice, [], [], SearchQuerySlice
> = (set) => ({
  query: {
    dateFrom: "",
    dateTo: "",
    index: {},
    fullText: "",
    selectedFacets: {}
  } as SearchQueryParams,
  queryHistory: [],
  setQuery: update => set((prev) => ({
    ...prev,
    query: update,
    queryHistory: prev.query
        ? [...prev.queryHistory, prev.query]
        : prev.queryHistory
  }))
});

/**
 * Generate search query request body from search query parameters
 */
export function queryBodySelector(state: SearchQuerySlice): SearchQueryBody {
  let searchQueryRquestBody = createSearchQueryRquestBody(state.query);
  console.log('searchQueryRquestBody', searchQueryRquestBody);
  return searchQueryRquestBody;
}

export const searchHistorySelector = (
    state: SearchQuerySlice
): SearchQueryBody[] => {
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
    return state.query?.index[key] === type;
  });
}

export function createSearchQueryRquestBody(
    query: SearchQueryParams,
): SearchQueryBody {
  if (!query || !query.index || !query.selectedFacets) {
    return {};
  }
  const searchQuery = {} as SearchQueryBody;
  const fullText = query.fullText;

  if (fullText) {
    searchQuery.text = fullText;
  }

  searchQuery.terms = query.selectedFacets;

  searchQuery.date = {
    name: "sessionDate",
    from: query.dateFrom,
    to: query.dateTo,
  };

  return searchQuery;
}
