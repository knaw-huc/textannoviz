import { create } from "zustand";
import {
  ActiveSidebarTabSlice,
  createActiveSidebarTabSlice,
} from "./activeSidebarTabSlice";
import {
  ActivePanelsSlice,
  createActivePanelsSlice,
} from "./activePanelsSlice";

export const useDetailViewStore = create<
  ActiveSidebarTabSlice & ActivePanelsSlice
>()((...a) => ({
  ...createActiveSidebarTabSlice(...a),
  ...createActivePanelsSlice(...a),
}));
