import produce from "immer";
import { create, StateCreator } from "zustand";
import { AnnoRepoAnnotation } from "../model/AnnoRepoAnnotation";

export interface SelectedAnnSlice {
  selectedAnn: {
    bodyId: string;
    indicesToHighlight: number[];
  }[];
  updateSelectedAnn: (bodyId: string, indicesToHighlight: number[]) => void;
  removeSelectedAnn: (bodyId: string) => void;
}

export interface AnnotationsSlice {
  annotations: AnnoRepoAnnotation[];
  setAnnotations: (newAnnotations: AnnotationsSlice["annotations"]) => void;
}

const createSelectedAnnSlice: StateCreator<
  SelectedAnnSlice & AnnotationsSlice,
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

const createAnnotationSlice: StateCreator<
  SelectedAnnSlice & AnnotationsSlice,
  [],
  [],
  AnnotationsSlice
> = (set) => ({
  annotations: undefined,
  setAnnotations: (newAnnotations) =>
    set(() => ({ annotations: newAnnotations })),
});

export const useAnnotationStore = create<SelectedAnnSlice & AnnotationsSlice>()(
  (...a) => ({
    ...createSelectedAnnSlice(...a),
    ...createAnnotationSlice(...a),
  })
);
