import { StateCreator } from "zustand";
import { getUrlHash } from "../../utils/url/UrlHashUtils.ts";

export type TocSlice = {
  activeHeader: string;
  setActiveHeader: (headerId: string) => void;
};

export const createTocSlice: StateCreator<TocSlice, [], [], TocSlice> = (
  set,
) => ({
  activeHeader: getUrlHash() ?? "",
  setActiveHeader: (headerId) => set({ activeHeader: headerId }),
});
