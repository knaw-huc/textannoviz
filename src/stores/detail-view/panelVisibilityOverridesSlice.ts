import { StateCreator } from "zustand";

/**
 * Kept separate from {@link PanelVisibilityPreferencesSlice}
 * so it is never persisted: an override is a one-off "show this now", not a
 * change to the user's saved layout. Cleared on navigation.
 */
export type PanelVisibilityOverridesSlice = {
  panelVisibilityOverrides: Record<string, boolean>;
  /** Replace all overrides at once, so a new letter never inherits stale ones */
  setPanelVisibilityOverrides: (overrides: Record<string, boolean>) => void;
  resetPanelVisibilityOverrides: () => void;
};

export const createPanelVisibilityOverridesSlice: StateCreator<
  PanelVisibilityOverridesSlice,
  [],
  [],
  PanelVisibilityOverridesSlice
> = (set) => ({
  panelVisibilityOverrides: {},
  setPanelVisibilityOverrides: (overrides) =>
    set(() => ({ panelVisibilityOverrides: overrides })),
  resetPanelVisibilityOverrides: () =>
    set(() => ({ panelVisibilityOverrides: {} })),
});
