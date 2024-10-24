import { StateCreator } from "zustand";
import { SearchQuery } from "../../model/Search.ts";

type Timestamp = number;
export type DatedSearchQuery = {
  date: Timestamp;
  query: SearchQuery;
};

export type SearchHistorySlice = {
  searchQueryHistory: DatedSearchQuery[];
  updateSearchQueryHistory: (update: SearchQuery) => void;
};

export const createSearchHistorySlice: StateCreator<
  SearchHistorySlice,
  [],
  [],
  SearchHistorySlice
> = (set) => ({
  searchQueryHistory: [],
  updateSearchQueryHistory: (update: SearchQuery) => {
    const datedQuery: DatedSearchQuery = { date: Date.now(), query: update };
    return set((prev) => ({
      ...prev,
      searchQueryHistory: [...prev.searchQueryHistory, datedQuery],
    }));
  },
});
