import { create, StateCreator } from "zustand";
import { BroccoliTextGeneric } from "../model/Broccoli";

export interface TextSlice {
  text: BroccoliTextGeneric;
  setText: (newText: TextSlice["text"]) => void;
}

const createTextSlice: StateCreator<TextSlice, [], [], TextSlice> = (set) => ({
  text: {
    lines: [],
    locations: {
      relativeTo: {
        type: "",
        bodyId: "",
      },
      annotations: [],
    },
  },
  setText: (newText) => set(() => ({ text: newText })),
});

export const useTextStore = create<TextSlice>()((...a) => ({
  ...createTextSlice(...a),
}));
