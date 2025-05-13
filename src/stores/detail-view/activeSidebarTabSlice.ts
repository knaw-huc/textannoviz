import { Key } from "react-aria-components";
import { StateCreator } from "zustand";

export type ActiveSidebarTabSlice = {
  activeSidebarTab: Key;
  setActiveSidebarTab: (newActiveSidebarTab: Key) => void;
};

export const createActiveSidebarTabSlice: StateCreator<
  ActiveSidebarTabSlice,
  [],
  [],
  ActiveSidebarTabSlice
> = (set) => ({
  activeSidebarTab: "",
  setActiveSidebarTab: (newActiveSidebarTab) =>
    set(() => ({ activeSidebarTab: newActiveSidebarTab })),
});
