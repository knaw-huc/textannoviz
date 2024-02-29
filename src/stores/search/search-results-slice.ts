import { SearchResult } from "../../model/Search.ts";
import { StateCreator } from "zustand";

export type SearchResultsSlice = {
  searchResults: SearchResult | undefined;
  setSearchResults: (update: SearchResult) => void;
};

export const createSearchResultsSlice: StateCreator<
  SearchResultsSlice,
  [],
  [],
  SearchResultsSlice
> = (set) => ({
  searchResults: undefined,
  setSearchResults: (update) => set(() => ({ searchResults: update })),
});
