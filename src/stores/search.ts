import { create, StateCreator } from "zustand";
import { SearchQuery, SearchResult } from "../model/Search";

export type SearchResultsSlice = {
  globalSearchResults: SearchResult | undefined;
  setGlobalSearchResults: (
    newSearchResults: SearchResultsSlice["globalSearchResults"],
  ) => void;
};

export type SearchQuerySlice = {
  globalSearchQuery: SearchQuery | undefined;
  setGlobalSearchQuery: (
    newSearchQuery: SearchQuerySlice["globalSearchQuery"],
  ) => void;
};

export type TextToHighlightSlice = {
  textToHighlight: (string[] | undefined)[];
  setTextToHighlight: (
    newTextToHighlight: TextToHighlightSlice["textToHighlight"],
  ) => void;
};

const createSearchResultsSlice: StateCreator<
  SearchResultsSlice,
  [],
  [],
  SearchResultsSlice
> = (set) => ({
  globalSearchResults: undefined,
  setGlobalSearchResults: (newSearchResults) =>
    set(() => ({ globalSearchResults: newSearchResults })),
});

const createSearchQuerySlice: StateCreator<
  SearchQuerySlice,
  [],
  [],
  SearchQuerySlice
> = (set) => ({
  globalSearchQuery: undefined,
  setGlobalSearchQuery: (newSearchQuery) =>
    set(() => ({ globalSearchQuery: newSearchQuery })),
});

const createTextToHighlightSlice: StateCreator<
  TextToHighlightSlice,
  [],
  [],
  TextToHighlightSlice
> = (set) => ({
  textToHighlight: [],
  setTextToHighlight: (newTextToHighlight) =>
    set(() => ({ textToHighlight: newTextToHighlight })),
});

export const useSearchStore = create<
  SearchResultsSlice & SearchQuerySlice & TextToHighlightSlice
>()((...a) => ({
  ...createSearchResultsSlice(...a),
  ...createSearchQuerySlice(...a),
  ...createTextToHighlightSlice(...a),
}));
