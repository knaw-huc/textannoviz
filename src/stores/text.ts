import { create, StateCreator } from "zustand";
import { Broccoli } from "../model/Broccoli";

export type TextPanelsSlice = {
  views: Broccoli["views"] | undefined;
  setViews: (newViews: TextPanelsSlice["views"]) => void;
};

export type FootnoteSlice = {
  activeFootnote: string;
  setActiveFootnote: (footnoteId: string) => void;
  resetActiveFootnote: () => void;
};

const createFootnoteSlice: StateCreator<
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

const createTextPanelsSlice: StateCreator<
  TextPanelsSlice,
  [],
  [],
  TextPanelsSlice
> = (set) => ({
  views: undefined,
  setViews: (newViews) => set(() => ({ views: newViews })),
});

export const useTextStore = create<TextPanelsSlice & FootnoteSlice>()(
  (...a) => ({
    ...createTextPanelsSlice(...a),
    ...createFootnoteSlice(...a),
  }),
);
