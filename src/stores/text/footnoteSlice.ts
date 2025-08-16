import { StateCreator } from "zustand";

export type FootnoteSlice = {
  activeFootnote: string;
  setActiveFootnote: (footnoteId: string) => void;
  resetActiveFootnote: () => void;
};

export const createFootnoteSlice: StateCreator<
  FootnoteSlice,
  [],
  [],
  FootnoteSlice
> = (set) => ({
  activeFootnote: "",

  setActiveFootnote: (footnoteId) => {
    set(() => ({ activeFootnote: footnoteId }));
  },

  resetActiveFootnote() {
    set(() => ({ activeFootnote: "" }));
  },
});
