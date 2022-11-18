import React from "react";
import { AnnotationAction } from "./AnnotationActions";
import { AnnotationState, initAnnotationState } from "./AnnotationReducer";

interface AnnotationContext {
  annotationState: AnnotationState;
  annotationDispatch: React.Dispatch<AnnotationAction>;
}

const initAnnotationContext: AnnotationContext = {
  annotationState: initAnnotationState,
  annotationDispatch: null,
};

export const annotationContext = React.createContext<AnnotationContext>(
  initAnnotationContext
);
