import { create, StateCreator } from "zustand";
import { BroccoliText } from "../model/Broccoli";

export interface TextSlice {
  text: BroccoliText | undefined;
  addText: () => void;
}

export interface TextToHighlightSlice {
  textToHighlight: BroccoliText | undefined;
  addTextToHighlight: () => void;
}

const createTextSlice: StateCreator<
  TextSlice & TextToHighlightSlice,
  [],
  [],
  TextSlice
> = (set) => ({
  text: undefined,
  addText: () => set((state) => ({ text: state.text })),
});

const createTextToHighlightSlice: StateCreator<
  TextSlice & TextToHighlightSlice,
  [],
  [],
  TextToHighlightSlice
> = (set) => ({
  textToHighlight: undefined,
  addTextToHighlight: () =>
    set((state) => ({ textToHighlight: state.textToHighlight })),
});

export const useTextStore = create<TextSlice & TextToHighlightSlice>()(
  (...a) => ({
    ...createTextSlice(...a),
    ...createTextToHighlightSlice(...a),
  })
);
