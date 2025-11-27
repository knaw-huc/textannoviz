import { create, StateCreator } from "zustand";
import { AnnoRepoAnnotation, NoteBody } from "../model/AnnoRepoAnnotation";

export type AnnotationsSlice = {
  annotations: AnnoRepoAnnotation[];
  setAnnotations: (newAnnotations: AnnotationsSlice["annotations"]) => void;
};

export type PtrToNoteAnnosSlice = {
  ptrToNoteAnnosMap: Map<string, AnnoRepoAnnotation<NoteBody>>;
  setPtrToNoteAnnosMap: (
    newPtrToNoteAnnosMap: PtrToNoteAnnosSlice["ptrToNoteAnnosMap"],
  ) => void;
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

const createPtrToNoteAnnosMapSlice: StateCreator<
  PtrToNoteAnnosSlice,
  [],
  [],
  PtrToNoteAnnosSlice
> = (set) => ({
  ptrToNoteAnnosMap: new Map<string, AnnoRepoAnnotation<NoteBody>>(),
  setPtrToNoteAnnosMap: (newPtrToNoteAnnosMap) =>
    set(() => ({ ptrToNoteAnnosMap: new Map(newPtrToNoteAnnosMap) })),
});

export const useAnnotationStore = create<
  AnnotationsSlice &
    AnnotationTypesToIncludeSlice &
    AnnotationTypesToHighlightSlice &
    ShowSvgsAnnosMiradorSlice &
    PtrToNoteAnnosSlice
>()((...a) => ({
  ...createAnnotationSlice(...a),
  ...createAnnotationTypesToIncluceSlice(...a),
  ...createAnnotationTypesToHighlightSlice(...a),
  ...createShowSvgsAnnosMiradorSlice(...a),
  ...createPtrToNoteAnnosMapSlice(...a),
}));
