import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  ActiveSidebarTabSlice,
  createActiveSidebarTabSlice,
} from "./activeSidebarTabSlice";
import {
  ActivePanelsSlice,
  createActivePanelsSlice,
} from "./activePanelsSlice";
import {
  PanelVisibilityPreferencesSlice,
  createPanelVisibilityPreferencesSlice,
} from "./panelVisibilityPreferencesSlice";

export const useDetailViewStore = create<
  ActiveSidebarTabSlice & ActivePanelsSlice & PanelVisibilityPreferencesSlice
>()(
  persist(
    (...a) => ({
      ...createActiveSidebarTabSlice(...a),
      ...createActivePanelsSlice(...a),
      ...createPanelVisibilityPreferencesSlice(...a),
    }),
    {
      name: "detail-view-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        panelVisibilityPreferences: state.panelVisibilityPreferences,
      }),
    },
  ),
);
