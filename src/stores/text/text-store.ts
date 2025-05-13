import { create } from "zustand";
import { createFootnoteSlice, FootnoteSlice } from "./footnoteSlice";
import { createTextPanelsSlice, TextPanelsSlice } from "./textPanelsSlice";

export const useTextStore = create<TextPanelsSlice & FootnoteSlice>()(
  (...a) => ({
    ...createTextPanelsSlice(...a),
    ...createFootnoteSlice(...a),
  }),
);
