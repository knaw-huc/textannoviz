import { StateCreator } from "zustand";
import { SearchQuery } from "../../model/Search.ts";
import { createJSONStorage, persist } from "zustand/middleware";

export type DefaultQuerySlice = {
  defaultQuery: SearchQuery;
  isInitDefaultQuery: boolean;
  setDefaultQuery: (update: SearchQuery) => void;
};

export const blankSearchQuery: SearchQuery = {
  dateFrom: "",
  dateTo: "",
  rangeFrom: "",
  rangeTo: "",
  fullText: "",
  terms: {},
};

export const createDefaultQuerySlice: StateCreator<
  DefaultQuerySlice,
  [],
  [["zustand/persist", unknown]],
  DefaultQuerySlice
> = persist(
  (set) => ({
    isInitDefaultQuery: false,
    defaultQuery: blankSearchQuery,
    setDefaultQuery: (update) =>
      set(() => ({
        defaultQuery: update,
        isInitDefaultQuery: true,
      })),
  }),
  {
    name: "default-query",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      defaultQuery: state.defaultQuery,
      isInitDefaultQuery: state.isInitDefaultQuery,
    }),
  },
);
