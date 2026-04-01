import { StateCreator } from "zustand";
import { GroupedSegments } from "../../components/Text/Annotated/core";

export type AnnotatedTextSlice = {
  clickedGroup: GroupedSegments | null;
  setClickedGroup: (group: GroupedSegments | null) => void;
};

export const createAnnotatedTextSlice: StateCreator<
  AnnotatedTextSlice,
  [],
  [],
  AnnotatedTextSlice
> = (set) => ({
  clickedGroup: null,
  setClickedGroup: (group) => set({ clickedGroup: group }),
});
