import { StateCreator } from "zustand";
import { ProjectConfig } from "../../model/ProjectConfig";

export type ActivePanelsSlice = {
  activePanels: ProjectConfig["detailPanels"];
  setActivePanels: (newActivePanels: ProjectConfig["detailPanels"]) => void;
};

export const createActivePanelsSlice: StateCreator<
  ActivePanelsSlice,
  [],
  [],
  ActivePanelsSlice
> = (set) => ({
  activePanels: [],
  setActivePanels: (newActivePanels) =>
    set(() => ({ activePanels: newActivePanels })),
});
