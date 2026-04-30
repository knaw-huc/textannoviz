import { StateCreator } from "zustand";
import { DetailPanelConfig } from "../../model/ProjectConfig";

export type ActivePanelsSlice = {
  activePanels: DetailPanelConfig[];
  setActivePanels: (newActivePanels: DetailPanelConfig[]) => void;
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
