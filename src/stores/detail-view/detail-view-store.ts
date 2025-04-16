import { create } from "zustand";
import {
  ActiveSidebarTabSlice,
  createActiveSidebarTabSlice,
} from "./activeSidebarTabSlice";

export const useDetailViewStore = create<ActiveSidebarTabSlice>()((...a) => ({
  ...createActiveSidebarTabSlice(...a),
}));
