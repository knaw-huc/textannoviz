import { StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SearchQuery } from "./search-query-slice.ts";
import _ from "lodash";

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
      return set((prev) => {
        if (
          prev.searchQueryHistory.find((entry) =>
            _.isEqual(entry.query, update),
          )
        ) {
          console.debug("query already exists in history", {
            query: update,
            history: prev.searchQueryHistory,
          });
          return prev;
        }
        const datedQuery: DatedSearchQuery = {
          date: Date.now(),
          query: update,
        };
        return {
          ...prev,
          searchQueryHistory: [...prev.searchQueryHistory, datedQuery],
        };
      });
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
