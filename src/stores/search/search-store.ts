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

type SearchStore = SearchResultsSlice & SearchParamsSlice & SearchQuerySlice;

export const useSearchStore = create<SearchStore>()((...a) => ({
  ...createSearchResultsSlice(...a),
  ...createSearchParamsSlice(...a),
  ...createSearchQuerySlice(...a),
}));
