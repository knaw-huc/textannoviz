import { create, StateCreator } from "zustand";
import { Broccoli } from "../model/Broccoli";

export type TextPanelsSlice = {
  views: Broccoli["views"] | undefined;
  setViews: (newViews: TextPanelsSlice["views"]) => void;
};

export type FootnoteSlice = {
  activeFootnote: string | null;
  footnoteRefs: Map<string, HTMLSpanElement>;
  registerFootnotes: (footnoteId: string, ref: HTMLSpanElement) => void;
  scrollToFootnote: (footnoteId: string) => void;
  setActiveFootnote: (footnoteId: string) => void;
};

const createFootnoteSlice: StateCreator<
  FootnoteSlice,
  [],
  [],
  FootnoteSlice
> = (set, get) => ({
  footnoteRefs: new Map(),
  activeFootnote: null,

  registerFootnotes: (footnoteId, ref) =>
    set((state) => {
      const newRefs = new Map(state.footnoteRefs);
      newRefs.set(footnoteId, ref);
      return { footnoteRefs: newRefs };
    }),

  scrollToFootnote: (footnoteId) => {
    const ref = get().footnoteRefs.get(footnoteId);
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
      set({ activeFootnote: footnoteId });

      //Remove highlight after 3 seconds
      // setTimeout(() => set({ activeFootnote: null }), 3000);
    }
  },
  setActiveFootnote: (footnoteId) => {
    set(() => ({ activeFootnote: footnoteId }));
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
