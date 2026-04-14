import { create, StateCreator } from "zustand";
import { AnnoRepoAnnotation } from "../model/AnnoRepoAnnotation";

export type AnnotationsSlice = {
  annotations: AnnoRepoAnnotation[];
  setAnnotations: (newAnnotations: AnnotationsSlice["annotations"]) => void;
};

export type BodyIdSlice = {
  bodyId: string | null;
  setBodyId: (bodyId: string | null) => void;
};

export type PtrToNoteAnnosSlice = {
  ptrToNoteAnnosMap: Map<string, AnnoRepoAnnotation>;
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

const createBodyIdSlice: StateCreator<BodyIdSlice, [], [], BodyIdSlice> = (
  set,
) => ({
  bodyId: null,
  setBodyId: (bodyId: string | null) => set(() => ({ bodyId })),
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

const createPtrToNoteAnnosMapSlice: StateCreator<
  PtrToNoteAnnosSlice,
  [],
  [],
  PtrToNoteAnnosSlice
> = (set) => ({
  ptrToNoteAnnosMap: new Map<string, AnnoRepoAnnotation>(),
  setPtrToNoteAnnosMap: (newPtrToNoteAnnosMap) =>
    set(() => ({ ptrToNoteAnnosMap: new Map(newPtrToNoteAnnosMap) })),
});

export const useAnnotationStore = create<
  AnnotationsSlice &
    AnnotationTypesToIncludeSlice &
    AnnotationTypesToHighlightSlice &
    BodyIdSlice &
    PtrToNoteAnnosSlice
>()((...a) => ({
  ...createAnnotationSlice(...a),
  ...createBodyIdSlice(...a),
  ...createAnnotationTypesToIncluceSlice(...a),
  ...createAnnotationTypesToHighlightSlice(...a),
  ...createPtrToNoteAnnosMapSlice(...a),
}));
