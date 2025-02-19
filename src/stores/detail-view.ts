import { Key } from "react-aria-components";
import { create, StateCreator } from "zustand";

export type ActiveSidebarTabSlice = {
  activeSidebarTab: Key;
  setActiveSidebarTab: (newActiveSidebarTab: Key) => void;
};

const createActiveSidebarTabSlice: StateCreator<
  ActiveSidebarTabSlice,
  [],
  [],
  ActiveSidebarTabSlice
> = (set) => ({
  activeSidebarTab: "",
  setActiveSidebarTab: (newActiveSidebarTab) =>
    set(() => ({ activeSidebarTab: newActiveSidebarTab })),
});

export const useDetailViewStore = create<ActiveSidebarTabSlice>()((...a) => ({
  ...createActiveSidebarTabSlice(...a),
}));
