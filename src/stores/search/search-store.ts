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
  createKeywordFacetsSlice,
  KeywordFacetsSlice,
} from "./keyword-facets-slice.ts";

export type SearchStore = SearchResultsSlice &
  SearchParamsSlice &
  SearchQuerySlice &
  SearchFacetTypesSlice &
  KeywordFacetsSlice;

export const useSearchStore = create<SearchStore>()((...a) => ({
  ...createKeywordFacetsSlice(...a),
  ...createSearchFacetTypesSlice(...a),
  ...createSearchResultsSlice(...a),
  ...createSearchParamsSlice(...a),
  ...createSearchQuerySlice(...a),
}));
