import React from "react";
import { annotationContext } from "./state/annotation/AnnotationContext";
import { useAnnotationState } from "./state/annotation/AnnotationReducer";
import { miradorContext } from "./state/mirador/MiradorContext";
import { useMiradorState } from "./state/mirador/MiradorReducer";

export const Providers = (props: { children: React.ReactNode }) => {
  const [miradorState, miradorDispatch] = useMiradorState();
  const [annotationState, annotationDispatch] = useAnnotationState();

  return (
    <miradorContext.Provider value={{ miradorState, miradorDispatch }}>
      <annotationContext.Provider
        value={{ annotationState, annotationDispatch }}
      >
        {props.children}
      </annotationContext.Provider>
    </miradorContext.Provider>
  );
};
