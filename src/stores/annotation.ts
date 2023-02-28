import produce from "immer";
import { create, StateCreator } from "zustand";

export interface SelectedAnnSlice {
  selectedAnn: {
    bodyId: string;
    indicesToHighlight: number[];
  }[];
  updateSelectedAnn: (bodyId: string, indicesToHighlight: number[]) => void;
  removeSelectedAnn: (bodyId: string) => void;
}

const createSelectedAnnSlice: StateCreator<
  SelectedAnnSlice,
  [],
  [],
  SelectedAnnSlice
> = (set) => ({
  selectedAnn: [],
  updateSelectedAnn: (bodyId: string, indicesToHighlight: number[]) =>
    set(
      produce((state: SelectedAnnSlice) => {
        state.selectedAnn.push({
          bodyId: bodyId,
          indicesToHighlight: indicesToHighlight,
        });
      })
    ),
  removeSelectedAnn: (bodyId: string) =>
    set(
      produce((state: SelectedAnnSlice) => {
        const index = state.selectedAnn.findIndex((el) => el.bodyId === bodyId);
        state.selectedAnn.splice(index, 1);
      })
    ),
});

export const useAnnotationStore = create<SelectedAnnSlice>()((...a) => ({
  ...createSelectedAnnSlice(...a),
}));
