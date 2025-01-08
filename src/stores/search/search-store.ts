import { create } from "zustand";
import {
  createSearchResultsSlice,
  SearchResultsSlice,
} from "./search-results-slice.ts";
import {
  createSearchHistorySlice,
  SearchHistorySlice,
} from "./search-history-slice.ts";
import {
  createSearchFacetTypesSlice,
  SearchFacetTypesSlice,
} from "./search-facet-types-slice.ts";
import {
  createKeywordFacetsSlice,
  KeywordFacetsSlice,
} from "./keyword-facets-slice.ts";
import {
  createDefaultQuerySlice,
  DefaultQuerySlice,
} from "./default-query-slice.ts";

export type SearchStore = DefaultQuerySlice &
  SearchResultsSlice &
  SearchHistorySlice &
  SearchFacetTypesSlice &
  KeywordFacetsSlice;

export const useSearchStore = create<SearchStore>()((...a) => ({
  ...createDefaultQuerySlice(...a),
  ...createKeywordFacetsSlice(...a),
  ...createSearchFacetTypesSlice(...a),
  ...createSearchResultsSlice(...a),
  ...createSearchHistorySlice(...a),
}));

export function defaultQuerySettersSelector(state: SearchStore) {
  return {
    setKeywordFacets: state.setKeywordFacets,
    setSearchFacetTypes: state.setSearchFacetTypes,
    setDefaultQuery: state.setDefaultQuery,
  };
}
