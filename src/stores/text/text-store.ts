import { create } from "zustand";
import { createFootnoteSlice, FootnoteSlice } from "./footnoteSlice";
import { createTextPanelsSlice, TextPanelsSlice } from "./textPanelsSlice";
import {
  AnnotatedTextSlice,
  createAnnotatedTextSlice,
} from "./annotatedTextSlice.ts";

export const useTextStore = create<
  TextPanelsSlice & FootnoteSlice & AnnotatedTextSlice
>()((...a) => ({
  ...createTextPanelsSlice(...a),
  ...createFootnoteSlice(...a),
  ...createAnnotatedTextSlice(...a),
}));
