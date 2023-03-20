import produce from "immer";
import { create, StateCreator } from "zustand";
import { AnnoRepoAnnotation } from "../model/AnnoRepoAnnotation";

export interface OpenAnnSlice {
  openAnn: {
    bodyId: string;
    indicesToHighlight: number[];
  }[];
  updateOpenAnn: (bodyId: string, indicesToHighlight: number[]) => void;
  removeOpenAnn: (bodyId: string) => void;
  resetOpenAnn: () => void;
}

export interface CurrentSelectedAnnSlice {
  currentSelectedAnn: string | undefined;
  setCurrentSelectedAnn: (bodyId: string) => void;
}

export interface AnnotationsSlice {
  annotations: AnnoRepoAnnotation[];
  setAnnotations: (newAnnotations: AnnotationsSlice["annotations"]) => void;
}

const createOpenAnnSlice: StateCreator<
  OpenAnnSlice & AnnotationsSlice & CurrentSelectedAnnSlice,
  [],
  [],
  OpenAnnSlice
> = (set) => ({
  openAnn: [],
  updateOpenAnn: (bodyId: string, indicesToHighlight: number[]) =>
    set(
      produce((state: OpenAnnSlice) => {
        state.openAnn.push({
          bodyId: bodyId,
          indicesToHighlight: indicesToHighlight,
        });
      })
    ),
  removeOpenAnn: (bodyId: string) =>
    set(
      produce((state: OpenAnnSlice) => {
        const index = state.openAnn.findIndex((el) => el.bodyId === bodyId);
        state.openAnn.splice(index, 1);
      })
    ),
  resetOpenAnn: () => set(() => ({ openAnn: [] })),
});

const createAnnotationSlice: StateCreator<
  OpenAnnSlice & AnnotationsSlice & CurrentSelectedAnnSlice,
  [],
  [],
  AnnotationsSlice
> = (set) => ({
  annotations: undefined,
  setAnnotations: (newAnnotations) =>
    set(() => ({ annotations: newAnnotations })),
});

const createCurrentSelectedAnnSlice: StateCreator<
  OpenAnnSlice & AnnotationsSlice & CurrentSelectedAnnSlice,
  [],
  [],
  CurrentSelectedAnnSlice
> = (set) => ({
  currentSelectedAnn: undefined,
  setCurrentSelectedAnn: (newCurrentSelectedAnn) =>
    set(() => ({ currentSelectedAnn: newCurrentSelectedAnn })),
});

export const useAnnotationStore = create<
  OpenAnnSlice & AnnotationsSlice & CurrentSelectedAnnSlice
>()((...a) => ({
  ...createOpenAnnSlice(...a),
  ...createAnnotationSlice(...a),
  ...createCurrentSelectedAnnSlice(...a),
}));
