import {StateCreator} from "zustand";

export type SortOrder = "desc" | "asc";

export type SearchUrlParams = {
  fragmenter: string,
  from: number,
  size: number,
  sortBy: string,
  sortOrder: SortOrder,
};

export type SearchParamsSlice = {
  searchUrlParams: SearchUrlParams;
  setSearchUrlParams: (update: SearchUrlParams) => void;
};

export const createSearchParamsSlice: StateCreator<
    SearchParamsSlice, [], [], SearchParamsSlice
> = (set) => ({
  searchUrlParams: {
    fragmenter: "Scan",
    from: 0,
    size: 10,
    sortBy: "_score",
    sortOrder: "desc"
  },
  setSearchUrlParams: update => set(() => ({ searchUrlParams: update }))
});
