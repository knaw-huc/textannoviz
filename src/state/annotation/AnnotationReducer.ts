import produce from "immer";
import React from "react";
import { create } from "zustand";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import {
  AnnotationAction,
  ANNOTATION_ACTIONS,
  SetAnnotation,
  SetAnnotationItemOpen,
} from "./AnnotationActions";

export interface AnnotationState {
  annotation: AnnoRepoAnnotation[];
  annotationItemOpen: boolean;
}

export const initAnnotationState: AnnotationState = {
  annotation: null,
  annotationItemOpen: false,
};

interface SelectedAnn {
  selectedAnn: {
    bodyId: string;
    indicesToHighlight: number[];
  }[];
  updateSelectedAnn: (bodyId: string, indicesToHighlight: number[]) => void;
  removeSelectedAnn: (bodyId: string) => void;
}

export const useSelectedAnn = create<SelectedAnn>((set) => ({
  selectedAnn: [],
  updateSelectedAnn: (bodyId: string, indicesToHighlight: number[]) =>
    // set((state) => ({ selectedAnn: [...state.selectedAnn, bodyId] })),
    set(
      produce((state: SelectedAnn) => {
        state.selectedAnn.push({
          bodyId: bodyId,
          indicesToHighlight: indicesToHighlight,
        });
      })
    ),
  removeSelectedAnn: (bodyId: string) =>
    set(
      produce((state: SelectedAnn) => {
        const index = state.selectedAnn.findIndex((el) => el.bodyId === bodyId);
        state.selectedAnn.splice(index, 1);
      })
    ),
  // set((state) => ({
  //   selectedAnn: state.selectedAnn.filter((ann) => ann !== bodyId),
  // })),
}));

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

const setAnnotationItemOpen = (
  state: AnnotationState,
  action: SetAnnotationItemOpen
) => {
  return {
    ...state,
    annotationItemOpen: action.annotationItemOpen,
  };
};
