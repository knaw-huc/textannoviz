import React from "react";
import { annotationContext } from "./state/annotation/AnnotationContext";
import { useAnnotationState } from "./state/annotation/AnnotationReducer";
import { miradorContext } from "./state/mirador/MiradorContext";
import { useMiradorState } from "./state/mirador/MiradorReducer";
import { textContext } from "./state/text/TextContext";
import { useTextState } from "./state/text/TextReducer";

export const Providers = (props: { children: React.ReactNode }) => {
  const [miradorState, miradorDispatch] = useMiradorState();
  const [annotationState, annotationDispatch] = useAnnotationState();
  const [textState, textDispatch] = useTextState();

  return (
    <miradorContext.Provider value={{ miradorState, miradorDispatch }}>
      <annotationContext.Provider
        value={{ annotationState, annotationDispatch }}
      >
        <textContext.Provider value={{ textState, textDispatch }}>
          {props.children}
        </textContext.Provider>
      </annotationContext.Provider>
    </miradorContext.Provider>
  );
};
