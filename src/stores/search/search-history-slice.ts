import { StateCreator } from "zustand";
import { SearchQuery } from "../../model/Search.ts";
import { persist, createJSONStorage } from "zustand/middleware";

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
  [["zustand/persist", unknown]],
  SearchHistorySlice
> = persist(
  (set) => ({
    searchQueryHistory: [],
    updateSearchQueryHistory: (update: SearchQuery) => {
      const datedQuery: DatedSearchQuery = { date: Date.now(), query: update };
      return set((prev) => ({
        ...prev,
        searchQueryHistory: [...prev.searchQueryHistory, datedQuery],
      }));
    },
  }),
  {
    name: "search-history",
    storage: createJSONStorage(() => sessionStorage),
  },
);
