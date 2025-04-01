import { StateCreator } from "zustand";

import { FacetEntry } from "../../model/Search.ts";

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
