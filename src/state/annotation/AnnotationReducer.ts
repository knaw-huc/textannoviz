import React from "react";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import {
  AnnotationAction,
  ANNOTATION_ACTIONS,
  SetAnnotation,
  SetAnnotationItemOpen,
  SetSelectedAnnotation,
} from "./AnnotationActions";

export interface AnnotationState {
  annotation: AnnoRepoAnnotation[];
  selectedAnnotation: AnnoRepoAnnotation | undefined;
  annotationItemOpen: boolean;
}

export const initAnnotationState: AnnotationState = {
  annotation: null,
  selectedAnnotation: undefined,
  annotationItemOpen: false,
};

export const useAnnotationState = (): [
  AnnotationState,
  React.Dispatch<AnnotationAction>
] => {
  const [state, dispatch] = React.useReducer(
    annotationReducer,
    initAnnotationState
  );

  return [state, dispatch];
};

const annotationReducer = (
  state: AnnotationState,
  action: AnnotationAction
): AnnotationState => {
  console.log(action, state);

  switch (action.type) {
    case ANNOTATION_ACTIONS.SET_ANNOTATION:
      return setAnnotation(state, action);
    case ANNOTATION_ACTIONS.SET_SELECTEDANNOTATION:
      return setSelectedAnnotation(state, action);
    case ANNOTATION_ACTIONS.SET_ANNOTATIONITEMOPEN:
      return setAnnotationItemOpen(state, action);
    default:
      break;
  }

  return state;
};

const setAnnotation = (state: AnnotationState, action: SetAnnotation) => {
  return {
    ...state,
    annotation: action.annotation,
  };
};

const setSelectedAnnotation = (
  state: AnnotationState,
  action: SetSelectedAnnotation
) => {
  return {
    ...state,
    selectedAnnotation: action.selectedAnnotation,
  };
};

const setAnnotationItemOpen = (
  state: AnnotationState,
  action: SetAnnotationItemOpen
) => {
  return {
    ...state,
    annotationItemOpen: action.annotationItemOpen,
  };
};