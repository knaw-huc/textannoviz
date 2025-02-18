import { Key } from "react-aria-components";
import { create, StateCreator } from "zustand";
import { AnnoRepoAnnotation } from "../model/AnnoRepoAnnotation";

export type AnnotationsSlice = {
  annotations: AnnoRepoAnnotation[];
  setAnnotations: (newAnnotations: AnnotationsSlice["annotations"]) => void;
};
export type AnnotationTypesToIncludeSlice = {
  annotationTypesToInclude: string[];
  setAnnotationTypesToInclude: (
    newAnnotationTypesToInclude: AnnotationTypesToIncludeSlice["annotationTypesToInclude"],
  ) => void;
};

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

export type ActiveSidebarPanel = {
  activeSidebarPanel: Key;
  setActiveSidebarPanel: (newActiveSidebarPanel: Key) => void;
};

const createAnnotationSlice: StateCreator<
  AnnotationsSlice,
  [],
  [],
  AnnotationsSlice
> = (set) => ({
  annotations: [],
  setAnnotations: (newAnnotations) =>
    set(() => ({ annotations: newAnnotations })),
});

const createAnnotationTypesToIncluceSlice: StateCreator<
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

const createActiveSidebarPanelSlice: StateCreator<
  ActiveSidebarPanel,
  [],
  [],
  ActiveSidebarPanel
> = (set) => ({
  activeSidebarPanel: "",
  setActiveSidebarPanel: (newActiveSidebarPanel) =>
    set(() => ({ activeSidebarPanel: newActiveSidebarPanel })),
});

export const useAnnotationStore = create<
  AnnotationsSlice &
    AnnotationTypesToIncludeSlice &
    AnnotationTypesToHighlightSlice &
    ShowSvgsAnnosMiradorSlice &
    ActiveSidebarPanel
>()((...a) => ({
  ...createAnnotationSlice(...a),
  ...createAnnotationTypesToIncluceSlice(...a),
  ...createAnnotationTypesToHighlightSlice(...a),
  ...createShowSvgsAnnosMiradorSlice(...a),
  ...createActiveSidebarPanelSlice(...a),
}));
