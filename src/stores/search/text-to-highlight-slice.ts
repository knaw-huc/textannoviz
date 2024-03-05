import { StateCreator } from "zustand";

type TextToHighlight = { text: Map<string, string[]>; exact: boolean };
export type TextToHighlightSlice = {
  textToHighlight: TextToHighlight;
  setTextToHighlight: (update: TextToHighlight) => void;
};

export const createTextToHighlightSlice: StateCreator<
  TextToHighlightSlice,
  [],
  [],
  TextToHighlightSlice
> = (set) => ({
  textToHighlight: {
    text: new Map(),
    exact: false,
  },
  setTextToHighlight: (update) => set(() => ({ textToHighlight: update })),
});
