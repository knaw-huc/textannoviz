import { create } from "zustand";
import {
  createSearchResultsSlice,
  SearchResultsSlice,
} from "./search-results-slice.ts";
import {
  createSearchParamsSlice,
  SearchParamsSlice,
} from "./search-params-slice.ts";
import {
  createSearchQuerySlice,
  SearchQuerySlice,
} from "./search-query-slice.ts";
import {
  createSearchFacetTypesSlice,
  SearchFacetTypesSlice,
} from "./search-facet-types-slice.ts";
import {
  createSearchHistorySlice,
  SearchHistorySlice,
} from "./search-history-slice.ts";

export type SearchStore = SearchResultsSlice &
  SearchParamsSlice &
  SearchQuerySlice &
  SearchFacetTypesSlice &
  SearchHistorySlice;

export const useSearchStore = create<SearchStore>()((...a) => ({
  ...createSearchFacetTypesSlice(...a),
  ...createSearchResultsSlice(...a),
  ...createSearchParamsSlice(...a),
  ...createSearchQuerySlice(...a),
  ...createSearchHistorySlice(...a),
}));
