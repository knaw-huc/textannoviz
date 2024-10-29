import { StateCreator } from "zustand";
import { SearchQuery } from "../../model/Search.ts";
import { persist, createJSONStorage } from "zustand/middleware";

export type Timestamp = number;
export type DatedSearchQuery = {
  date: Timestamp;
  query: SearchQuery;
};

export type SearchHistorySlice = {
  searchQueryHistory: DatedSearchQuery[];
  addSearchQuery: (update: SearchQuery) => void;
  removeSearchQuery: (toDelete: Timestamp) => void;
};

export const createSearchHistorySlice: StateCreator<
  SearchHistorySlice,
  [],
  [["zustand/persist", unknown]],
  SearchHistorySlice
> = persist(
  (set) => ({
    searchQueryHistory: [],
    addSearchQuery: (update: SearchQuery) => {
      const datedQuery: DatedSearchQuery = { date: Date.now(), query: update };
      return set((prev) => ({
        ...prev,
        searchQueryHistory: [...prev.searchQueryHistory, datedQuery],
      }));
    },
    removeSearchQuery: (toRemove: Timestamp) => {
      return set((prev) => {
        const update = prev.searchQueryHistory.filter(
          (entry) => entry.date !== toRemove,
        );
        return {
          ...prev,
          searchQueryHistory: update,
        };
      });
    },
  }),
  {
    name: "search-history",
    storage: createJSONStorage(() => localStorage),
  },
);
