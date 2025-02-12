import { StateCreator } from "zustand";
import { SearchQuery } from "../../model/Search.ts";

export type DefaultQueryState = {
  defaultQuery: SearchQuery;
  isLoadingDefaultQuery: boolean;
  isInitDefaultQuery: boolean;
};

export type DefaultQuerySlice = DefaultQueryState & {
  setDefaultQueryState: (update: Partial<DefaultQueryState>) => void;
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
  isLoadingDefaultQuery: false,
  isInitDefaultQuery: false,
  setDefaultQueryState: (update: Partial<DefaultQueryState>) =>
    set((prev: DefaultQueryState) => ({ ...prev, ...update })),
});
