import { create, StateCreator } from "zustand";
import { BroccoliTextGeneric } from "../model/Broccoli";

export interface TextSlice {
  text: BroccoliTextGeneric | undefined;
  setText: (newText: TextSlice["text"]) => void;
}

const createTextSlice: StateCreator<TextSlice, [], [], TextSlice> = (set) => ({
  text: undefined,
  setText: (newText) => set(() => ({ text: newText })),
});

export const useTextStore = create<TextSlice>()((...a) => ({
  ...createTextSlice(...a),
}));
