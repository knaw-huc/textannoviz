import { StateCreator } from "zustand";
import { SortOrder } from "../../model/Search.ts";

export type SearchUrlParams = {
  indexName: string;
  fragmentSize: number;
  from: number;
  size: number;
  sortBy: string;
  sortOrder: SortOrder;
};

export type SearchParamsSlice = {
  searchUrlParams: SearchUrlParams;
  setSearchUrlParams: (update: SearchUrlParams) => void;
  resetPage: () => void;
};

export const createSearchParamsSlice: StateCreator<
  SearchParamsSlice,
  [],
  [],
  SearchParamsSlice
> = (set) => ({
  searchUrlParams: {
    indexName: "",
    fragmentSize: 100,
    from: 0,
    size: 10,
    sortBy: "_score",
    sortOrder: "desc",
  },
  setSearchUrlParams: (update) => set(() => ({ searchUrlParams: update })),
  resetPage: () =>
    set((prev) => {
      const update = {
        ...prev,
      };
      update.searchUrlParams.from = 0;
      return update;
    }),
});
