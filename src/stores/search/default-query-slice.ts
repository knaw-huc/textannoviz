import { StateCreator } from "zustand";
import { SearchQuery } from "../../model/Search.ts";

export type DefaultQuerySlice = {
  defaultQuery: SearchQuery;
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
  [],
  DefaultQuerySlice
> = (set) => ({
  defaultQuery: blankSearchQuery,
  setDefaultQuery: (update) => set(() => ({ defaultQuery: update })),
});
