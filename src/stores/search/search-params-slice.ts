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
  toFirstPage: () => void;
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
    // TODO: revert to 10
    size: 3,
    sortBy: "_score",
    sortOrder: "desc",
  },
  setSearchUrlParams: (update) => set(() => ({ searchUrlParams: update })),
  toFirstPage: () =>
    set((prev) => {
      const update = {
        ...prev,
      };
      update.searchUrlParams.from = 0;
      return update;
    }),
});
