import { StateCreator } from "zustand";

export type SearchInitStatusState = {
  isLoadingSearch: boolean;
  isInitSearch: boolean;
};

export type SearchInitStatusSlice = SearchInitStatusState & {
  setSearchInitStatus: (update: Partial<SearchInitStatusState>) => void;
};

export const createSearchInitStatusSlice: StateCreator<
  SearchInitStatusSlice,
  [],
  [],
  SearchInitStatusSlice
> = (set) => ({
  isLoadingSearch: false,
  isInitSearch: false,
  setSearchInitStatus: (update: Partial<SearchInitStatusState>) =>
    set((prev: SearchInitStatusState) => ({ ...prev, ...update })),
});
