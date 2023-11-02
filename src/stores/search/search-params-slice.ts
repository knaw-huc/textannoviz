import {StateCreator} from "zustand";

export type SortOrder = "desc" | "asc";

export type SearchParams = {
  fragmenter: string,
  from: number,
  size: number,
  sortBy: string,
  sortOrder: SortOrder,
};

export type SearchParamsSlice = {
  params: SearchParams;
  setParams: (update: SearchParams) => void;
};

export const createSearchParamsSlice: StateCreator<
    SearchParamsSlice, [], [], SearchParamsSlice
> = (set) => ({
  params: {
    fragmenter: "Scan",
    from: 0,
    size: 10,
    sortBy: "_score",
    sortOrder: "desc"
  },
  setParams: update => set(() => ({ params: update }))
});
