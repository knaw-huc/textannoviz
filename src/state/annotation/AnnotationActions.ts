import { AnnotationState } from "./AnnotationReducer";

export enum ANNOTATION_ACTIONS {
  SET_ANNOTATION = "SET_ANNOTATION",
  SET_ANNOTATIONITEMOPEN = "SET_ANNOTATIONITEMOPEN",
}

export type SetAnnotation = Pick<AnnotationState, "annotation"> & {
  type: ANNOTATION_ACTIONS.SET_ANNOTATION;
};

export type SetAnnotationItemOpen = Pick<
  AnnotationState,
  "annotationItemOpen"
> & {
  type: ANNOTATION_ACTIONS.SET_ANNOTATIONITEMOPEN;
};

export type AnnotationAction = SetAnnotation | SetAnnotationItemOpen;
