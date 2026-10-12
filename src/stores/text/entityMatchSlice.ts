import { StateCreator } from "zustand";
import { EntityMatch } from "../../components/Text/Annotated/utils/resolveEntityMatches";

export type EntityMatchSlice = {
  /**
   * Every entity mention in the open letter matching the facets the reader
   * filtered on, in the order they would meet them reading it. Empty when
   * nothing matches, when no facet is selected, or before the letter loads.
   */
  entityMatches: EntityMatch[];
  /**
   * Which of {@link EntityMatchSlice.entityMatches} the detail view reveals
   * and scrolls to. Out of range while the list is empty.
   */
  activeEntityMatchIndex: number;
  /**
   * Bumped on every pick of a match, so picking the active match again
   * reveals it again: the reveal keys on this as well as on the match, which
   * stays the same object when the index does not change.
   */
  entityMatchRevealCount: number;
  /** Replaces the list, and sends the reader to its first match */
  setEntityMatches: (matches: EntityMatch[]) => void;
  /** Sends the reader to a match, also when it is the active one */
  setActiveEntityMatchIndex: (index: number) => void;
  resetEntityMatches: () => void;
};

/**
 * The match the detail view is currently revealing, or undefined when there
 * is nothing to reveal.
 */
export const activeEntityMatchSelector = (
  state: EntityMatchSlice,
): EntityMatch | undefined => state.entityMatches[state.activeEntityMatchIndex];

export const createEntityMatchSlice: StateCreator<
  EntityMatchSlice,
  [],
  [],
  EntityMatchSlice
> = (set) => ({
  entityMatches: [],
  activeEntityMatchIndex: 0,
  entityMatchRevealCount: 0,

  setEntityMatches: (matches) => {
    set(() => ({ entityMatches: matches, activeEntityMatchIndex: 0 }));
  },

  setActiveEntityMatchIndex: (index) => {
    set((state) => ({
      activeEntityMatchIndex: index,
      entityMatchRevealCount: state.entityMatchRevealCount + 1,
    }));
  },

  resetEntityMatches() {
    set(() => ({ entityMatches: [], activeEntityMatchIndex: 0 }));
  },
});
