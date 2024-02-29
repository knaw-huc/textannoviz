import { create } from "zustand";
import {
  createSearchResultsSlice,
  SearchResultsSlice,
} from "./search-results-slice.ts";
import {
  createTextToHighlightSlice,
  TextToHighlightSlice,
} from "./text-to-highlight-slice.ts";
import {
  createSearchParamsSlice,
  SearchParamsSlice,
} from "./search-params-slice.ts";
import {
  createSearchQuerySlice,
  SearchQuerySlice,
} from "./search-query-slice.ts";

type SearchStore = SearchResultsSlice &
  TextToHighlightSlice &
  SearchParamsSlice &
  SearchQuerySlice;

export const useSearchStore = create<SearchStore>()((...a) => ({
  ...createSearchResultsSlice(...a),
  ...createTextToHighlightSlice(...a),
  ...createSearchParamsSlice(...a),
  ...createSearchQuerySlice(...a),
}));
