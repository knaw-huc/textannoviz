import { create, StateCreator } from "zustand";

import { Broccoli } from "../model/Broccoli";

export type TextPanelsSlice = {
  views: Broccoli["views"] | undefined;
  setViews: (newViews: TextPanelsSlice["views"]) => void;
};

const createTextPanelsSlice: StateCreator<
  TextPanelsSlice,
  [],
  [],
  TextPanelsSlice
> = (set) => ({
  views: undefined,
  setViews: (newViews) => set(() => ({ views: newViews })),
});

export const useTextStore = create<TextPanelsSlice>()((...a) => ({
  ...createTextPanelsSlice(...a),
}));
