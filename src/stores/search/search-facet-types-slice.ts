import { StateCreator } from "zustand";

import { FacetTypes } from "../../model/Search.ts";

export type SearchFacetTypesSlice = {
  searchFacetTypes: FacetTypes;
  setSearchFacetTypes: (update: FacetTypes) => void;
};

export const createSearchFacetTypesSlice: StateCreator<
  SearchFacetTypesSlice,
  [],
  [],
  SearchFacetTypesSlice
> = (set) => ({
  searchFacetTypes: {},
  setSearchFacetTypes: (update) => set(() => ({ searchFacetTypes: update })),
});
