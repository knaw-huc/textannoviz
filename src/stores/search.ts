import { create, StateCreator } from "zustand";
import { SearchResult } from "../model/Search";

export type SearchResultsSlice = {
  searchResults: SearchResult | undefined;
  setSearchResults: (
    newSearchResults: SearchResultsSlice["searchResults"],
  ) => void;
};

export type TextToHighlightSlice = {
  textToHighlight: Map<string, string[]>;
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
  searchResults: undefined,
  setSearchResults: (newSearchResults) =>
    set(() => ({ searchResults: newSearchResults })),
});

const createTextToHighlightSlice: StateCreator<
  TextToHighlightSlice, [], [], TextToHighlightSlice
> = (set) => ({
  textToHighlight: new Map(),
  setTextToHighlight: (newTextToHighlight) =>
    set(() => ({ textToHighlight: newTextToHighlight })),
});

type SearchStore = SearchResultsSlice & TextToHighlightSlice;
export const useSearchStore = create<
  SearchStore
>()((...a) => ({
  ...createSearchResultsSlice(...a),
  ...createTextToHighlightSlice(...a),
}));
