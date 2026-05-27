import { StateCreator } from "zustand";

export type PanelVisibilityPreferencesSlice = {
  panelVisibilityPreferences: Record<string, boolean>;
  setPanelVisibilityPreference: (name: string, visible: boolean) => void;
};

export const createPanelVisibilityPreferencesSlice: StateCreator<
  PanelVisibilityPreferencesSlice,
  [],
  [],
  PanelVisibilityPreferencesSlice
> = (set) => ({
  panelVisibilityPreferences: {},
  setPanelVisibilityPreference: (name, visible) =>
    set((state) => ({
      panelVisibilityPreferences: {
        ...state.panelVisibilityPreferences,
        [name]: visible,
      },
    })),
});
