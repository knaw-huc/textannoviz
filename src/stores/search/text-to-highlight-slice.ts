import {StateCreator} from "zustand";

type TextToHighlight = Map<string, string[]>;
export type TextToHighlightSlice = {
  textToHighlight: TextToHighlight;
  setTextToHighlight: (update: TextToHighlight) => void;
};


export const createTextToHighlightSlice: StateCreator<
    TextToHighlightSlice, [], [], TextToHighlightSlice
> = (set) => ({
  textToHighlight: new Map(),
  setTextToHighlight: (update) => set(() => ({ textToHighlight: update }))
});