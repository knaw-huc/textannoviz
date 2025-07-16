import { create } from "zustand";
import {
  createSelectedLanguageSlice,
  SelectedLanguageSlice,
} from "./selectedLanguageSlice";

export const useAppStore = create<SelectedLanguageSlice>()((...a) => ({
  ...createSelectedLanguageSlice(...a),
}));
