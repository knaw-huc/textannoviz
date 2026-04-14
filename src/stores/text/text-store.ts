import { create } from "zustand";
import { createFootnoteSlice, FootnoteSlice } from "./footnoteSlice";
import { createTextPanelsSlice, TextPanelsSlice } from "./textPanelsSlice";
import {
  AnnotatedTextSlice,
  createAnnotatedTextSlice,
} from "./annotatedTextSlice.ts";
import { createTocSlice, TocSlice } from "./tocSlice";

export const useTextStore = create<
  TextPanelsSlice & FootnoteSlice & AnnotatedTextSlice & TocSlice
>()((...a) => ({
  ...createTextPanelsSlice(...a),
  ...createFootnoteSlice(...a),
  ...createAnnotatedTextSlice(...a),
  ...createTocSlice(...a),
}));
