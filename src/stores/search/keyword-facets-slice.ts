import { StateCreator } from "zustand";
import { FacetEntry } from "./search-query-slice.ts";

export type KeywordFacetsSlice = {
  keywordFacets: FacetEntry[];
  setKeywordFacets: (update: FacetEntry[]) => void;
};

export const createKeywordFacetsSlice: StateCreator<
  KeywordFacetsSlice,
  [],
  [],
  KeywordFacetsSlice
> = (set) => ({
  keywordFacets: [],
  setKeywordFacets: (update) => set(() => ({ keywordFacets: update })),
});
