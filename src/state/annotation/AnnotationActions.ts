import { AnnotationState } from "./AnnotationReducer";

export enum ANNOTATION_ACTIONS {
  SET_ANNOTATION = "SET_ANNOTATION",
  SET_SELECTEDANNOTATION = "SET_SELECTEDANNOTATION",
  SET_ANNOTATIONITEMOPEN = "SET_ANNOTATIONITEMOPEN",
}

export type SetAnnotation = Pick<AnnotationState, "annotation"> & {
  type: ANNOTATION_ACTIONS.SET_ANNOTATION;
};

export type SetSelectedAnnotation = Pick<
  AnnotationState,
  "selectedAnnotation"
> & {
  type: ANNOTATION_ACTIONS.SET_SELECTEDANNOTATION;
};

export type SetAnnotationItemOpen = Pick<
  AnnotationState,
  "annotationItemOpen"
> & {
  type: ANNOTATION_ACTIONS.SET_ANNOTATIONITEMOPEN;
};

export type AnnotationAction =
  | SetAnnotation
  | SetSelectedAnnotation
  | SetAnnotationItemOpen;
