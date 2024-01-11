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
  currentSelectedAnn: string;
  setCurrentSelectedAnn: (bodyId: string) => void;
}

export interface AnnotationsSlice {
  annotations: AnnoRepoAnnotation[];
  setAnnotations: (newAnnotations: AnnotationsSlice["annotations"]) => void;
}

export interface AnnotationTypesToIncludeSlice {
  annotationTypesToInclude: string[];
  setAnnotationTypesToInclude: (
    newAnnotationTypesToInclude: AnnotationTypesToIncludeSlice["annotationTypesToInclude"],
  ) => void;
}

export type AnnotationTypesToHighlightSlice = {
  annotationTypesToHighlight: string[];
  setAnnotationTypesToHighlight: (
    newAnnotationTypesToHighlight: AnnotationTypesToHighlightSlice["annotationTypesToHighlight"],
  ) => void;
};

export type ShowSvgsAnnosMiradorSlice = {
  showSvgsAnnosMirador: boolean;
  setShowSvgsAnnosMirador: (
    newShowSvgsAnnosMirador: ShowSvgsAnnosMiradorSlice["showSvgsAnnosMirador"],
  ) => void;
};

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
      }),
    ),
  removeOpenAnn: (bodyId: string) =>
    set(
      produce((state: OpenAnnSlice) => {
        const index = state.openAnn.findIndex((el) => el.bodyId === bodyId);
        state.openAnn.splice(index, 1);
      }),
    ),
  resetOpenAnn: () => set(() => ({ openAnn: [] })),
});

const createAnnotationSlice: StateCreator<
  OpenAnnSlice &
    AnnotationsSlice &
    CurrentSelectedAnnSlice &
    AnnotationTypesToIncludeSlice,
  [],
  [],
  AnnotationsSlice
> = (set) => ({
  annotations: [],
  setAnnotations: (newAnnotations) =>
    set(() => ({ annotations: newAnnotations })),
});

const createCurrentSelectedAnnSlice: StateCreator<
  OpenAnnSlice &
    AnnotationsSlice &
    CurrentSelectedAnnSlice &
    AnnotationTypesToIncludeSlice,
  [],
  [],
  CurrentSelectedAnnSlice
> = (set) => ({
  currentSelectedAnn: "",
  setCurrentSelectedAnn: (newCurrentSelectedAnn) =>
    set(() => ({ currentSelectedAnn: newCurrentSelectedAnn })),
});

const createAnnotationTypesToIncluceSlice: StateCreator<
  OpenAnnSlice &
    AnnotationsSlice &
    CurrentSelectedAnnSlice &
    AnnotationTypesToIncludeSlice,
  [],
  [],
  AnnotationTypesToIncludeSlice
> = (set) => ({
  annotationTypesToInclude: [],
  setAnnotationTypesToInclude: (newAnnotationTypesToInclude) =>
    set(() => ({ annotationTypesToInclude: newAnnotationTypesToInclude })),
});

const createAnnotationTypesToHighlightSlice: StateCreator<
  AnnotationTypesToHighlightSlice,
  [],
  [],
  AnnotationTypesToHighlightSlice
> = (set) => ({
  annotationTypesToHighlight: [],
  setAnnotationTypesToHighlight: (newAnnotationTypesToHighlight) =>
    set(() => ({ annotationTypesToHighlight: newAnnotationTypesToHighlight })),
});

const createShowSvgsAnnosMiradorSlice: StateCreator<
  ShowSvgsAnnosMiradorSlice,
  [],
  [],
  ShowSvgsAnnosMiradorSlice
> = (set) => ({
  showSvgsAnnosMirador: true,
  setShowSvgsAnnosMirador: (newShowSvgsAnnosMirador) =>
    set(() => ({ showSvgsAnnosMirador: newShowSvgsAnnosMirador })),
});

export const useAnnotationStore = create<
  OpenAnnSlice &
    AnnotationsSlice &
    CurrentSelectedAnnSlice &
    AnnotationTypesToIncludeSlice &
    AnnotationTypesToHighlightSlice &
    ShowSvgsAnnosMiradorSlice
>()((...a) => ({
  ...createOpenAnnSlice(...a),
  ...createAnnotationSlice(...a),
  ...createCurrentSelectedAnnSlice(...a),
  ...createAnnotationTypesToIncluceSlice(...a),
  ...createAnnotationTypesToHighlightSlice(...a),
  ...createShowSvgsAnnosMiradorSlice(...a),
}));
