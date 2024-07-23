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

type SearchStore = SearchResultsSlice &
  SearchParamsSlice &
  SearchQuerySlice &
  SearchFacetTypesSlice;

export const useSearchStore = create<SearchStore>()((...a) => ({
  ...createSearchFacetTypesSlice(...a),
  ...createSearchResultsSlice(...a),
  ...createSearchParamsSlice(...a),
  ...createSearchQuerySlice(...a),
}));
