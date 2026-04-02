import { create } from "zustand";
import { createFootnoteSlice, FootnoteSlice } from "./footnoteSlice";
import { createTextPanelsSlice, TextPanelsSlice } from "./textPanelsSlice";
import { createTocSlice, TocSlice } from "./tocSlice";

export const useTextStore = create<
  TextPanelsSlice & FootnoteSlice & TocSlice
>()((...a) => ({
  ...createTextPanelsSlice(...a),
  ...createFootnoteSlice(...a),
  ...createTocSlice(...a),
}));
