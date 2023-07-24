import { create, StateCreator } from "zustand";
import { SearchResult } from "../model/Search";

export type SearchResultsSlice = {
  globalSearchResults: SearchResult | undefined;
  setGlobalSearchResults: (
    newSearchResults: SearchResultsSlice["globalSearchResults"],
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

export const useSearchStore = create<SearchResultsSlice>()((...a) => ({
  ...createSearchResultsSlice(...a),
}));
