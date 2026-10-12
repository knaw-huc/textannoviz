import { StateCreator } from "zustand";
import { SearchHit } from "../../components/Text/Annotated/utils/resolveSearchHits";

export type SearchHitSlice = {
  /**
   * Every hit of the reader's search in the open letter — entity mentions
   * matching the selected facets and full-text hits — in the order they would
   * meet them reading it. Empty when nothing matches, when nothing is searched
   * for, or before the letter loads.
   */
  searchHits: SearchHit[];
  /**
   * Which of {@link SearchHitSlice.searchHits} the detail view reveals
   * and scrolls to. Out of range while the list is empty.
   */
  activeSearchHitIndex: number;
  /**
   * Bumped on every pick of a match, so picking the active match again
   * reveals it again: the reveal keys on this as well as on the match, which
   * stays the same object when the index does not change.
   */
  searchHitRevealCount: number;
  /** Replaces the list, and sends the reader to its first match */
  setSearchHits: (matches: SearchHit[]) => void;
  /** Sends the reader to a match, also when it is the active one */
  setActiveSearchHitIndex: (index: number) => void;
  resetSearchHits: () => void;
};

/**
 * The match the detail view is currently revealing, or undefined when there
 * is nothing to reveal.
 */
export const activeSearchHitSelector = (
  state: SearchHitSlice,
): SearchHit | undefined => state.searchHits[state.activeSearchHitIndex];

export const createSearchHitSlice: StateCreator<
  SearchHitSlice,
  [],
  [],
  SearchHitSlice
> = (set) => ({
  searchHits: [],
  activeSearchHitIndex: 0,
  searchHitRevealCount: 0,

  setSearchHits: (matches) => {
    set(() => ({ searchHits: matches, activeSearchHitIndex: 0 }));
  },

  setActiveSearchHitIndex: (index) => {
    set((state) => ({
      activeSearchHitIndex: index,
      searchHitRevealCount: state.searchHitRevealCount + 1,
    }));
  },

  resetSearchHits() {
    set(() => ({ searchHits: [], activeSearchHitIndex: 0 }));
  },
});
