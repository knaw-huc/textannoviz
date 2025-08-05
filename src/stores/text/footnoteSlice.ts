import { StateCreator } from "zustand";

export type FootnoteSlice = {
  activeFootnote: string;
  setActiveFootnote: (footnoteNumber: string) => void;
  resetActiveFootnote: () => void;
};

export const createFootnoteSlice: StateCreator<
  FootnoteSlice,
  [],
  [],
  FootnoteSlice
> = (set) => ({
  activeFootnote: "",

  setActiveFootnote: (footnoteNumber) => {
    set(() => ({ activeFootnote: footnoteNumber }));
  },

  resetActiveFootnote() {
    set(() => ({ activeFootnote: "" }));
  },
});
