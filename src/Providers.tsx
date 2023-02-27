import React from "react";
import { annotationContext } from "./state/annotation/AnnotationContext";
import { useAnnotationState } from "./state/annotation/AnnotationReducer";
import { miradorContext } from "./state/mirador/MiradorContext";
import { useMiradorState } from "./state/mirador/MiradorReducer";
import { projectContext } from "./state/project/ProjectContext";
import { useProjectState } from "./state/project/ProjectReducer";

export const Providers = (props: { children: React.ReactNode }) => {
  const [miradorState, miradorDispatch] = useMiradorState();
  const [annotationState, annotationDispatch] = useAnnotationState();
  const [projectState, projectDispatch] = useProjectState();

  return (
    <projectContext.Provider value={{ projectState, projectDispatch }}>
      <miradorContext.Provider value={{ miradorState, miradorDispatch }}>
        <annotationContext.Provider
          value={{ annotationState, annotationDispatch }}
        >
          {props.children}
        </annotationContext.Provider>
      </miradorContext.Provider>
    </projectContext.Provider>
  );
};
