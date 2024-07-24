import { FacetTypes } from "../../model/Search.ts";
import { StateCreator } from "zustand";

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
