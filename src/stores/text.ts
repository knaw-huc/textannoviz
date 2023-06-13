import { create, StateCreator } from "zustand";
import { BroccoliTextGeneric } from "../model/Broccoli";

export type TextSlice = {
  text: BroccoliTextGeneric;
  setText: (newText: TextSlice["text"]) => void;
};

export type TextPanelsSlice = {
  views:
    | {
        notesEN: BroccoliTextGeneric;
        textOrig: BroccoliTextGeneric;
        textTrans: BroccoliTextGeneric;
        title: BroccoliTextGeneric;
      }
    | undefined;
  setViews: (newViews: TextPanelsSlice["views"]) => void;
};

const createTextSlice: StateCreator<TextSlice, [], [], TextSlice> = (set) => ({
  text: {
    lines: [],
    locations: {
      relativeTo: {
        bodyType: "",
        bodyId: "",
      },
      annotations: [],
    },
  },
  setText: (newText) => set(() => ({ text: newText })),
});

const createTextPanelsSlice: StateCreator<
  TextPanelsSlice,
  [],
  [],
  TextPanelsSlice
> = (set) => ({
  views: undefined,
  setViews: (newViews) => set(() => ({ views: newViews })),
});

export const useTextStore = create<TextSlice & TextPanelsSlice>()((...a) => ({
  ...createTextSlice(...a),
  ...createTextPanelsSlice(...a),
}));
