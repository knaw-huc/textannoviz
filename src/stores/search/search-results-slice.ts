import {SearchResult} from "../../model/Search.ts";
import {StateCreator} from "zustand";

export type SearchResultsSlice = {
  searchResult: SearchResult | undefined;
  setSearchResults: (update: SearchResult) => void;
};

export const createSearchResultsSlice: StateCreator<
    SearchResultsSlice,
    [],
    [],
    SearchResultsSlice
> = (set) => ({
  searchResult: undefined,
  setSearchResults: (update) => set(() => ({ searchResult: update }))
});