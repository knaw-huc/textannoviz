import { StateCreator } from "zustand";
import { SearchQuery } from "../../model/Search.ts";

export type SearchHistorySlice = {
  searchQueryHistory: SearchQuery[];
  updateSearchQueryHistory: (update: SearchQuery) => void;
};

export const createSearchHistorySlice: StateCreator<
  SearchHistorySlice,
  [],
  [],
  SearchHistorySlice
> = (set) => ({
  searchQueryHistory: [],
  updateSearchQueryHistory: (update: SearchQuery) =>
    set((prev) => ({
      ...prev,
      searchQueryHistory: [...prev.searchQueryHistory, update],
    })),
});
