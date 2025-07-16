import { StateCreator } from "zustand";
import { LanguageCode } from "../../model/Language";

export type SelectedLanguageSlice = {
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (newSelectedLanguage: LanguageCode) => void;
};

export const createSelectedLanguageSlice: StateCreator<
  SelectedLanguageSlice,
  [],
  [],
  SelectedLanguageSlice
> = (set) => ({
  selectedLanguage: "en",
  setSelectedLanguage: (newSelectedLanguage) =>
    set(() => ({ selectedLanguage: newSelectedLanguage })),
});
