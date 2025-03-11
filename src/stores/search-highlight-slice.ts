import { StateCreator } from "zustand";

export type SearchHighlightSlice = {
  isInitSearchHighlight: boolean;
  highlightedSearchId: string;
  setHighlightedSearchId: (newSearchId: string) => void;
};

export const createSearchHighlightSlice: StateCreator<
  SearchHighlightSlice,
  [],
  [],
  SearchHighlightSlice
> = (set) => ({
  isInitSearchHighlight: false,
  highlightedSearchId: "",
  setHighlightedSearchId: (update) =>
    set(() => ({
      highlightedSearchId: update,
      isInitSearchHighlight: true,
    })),
});
