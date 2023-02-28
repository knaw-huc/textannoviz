import React from "react";
import { miradorContext } from "./state/mirador/MiradorContext";
import { useMiradorState } from "./state/mirador/MiradorReducer";
import { projectContext } from "./state/project/ProjectContext";
import { useProjectState } from "./state/project/ProjectReducer";

export const Providers = (props: { children: React.ReactNode }) => {
  const [miradorState, miradorDispatch] = useMiradorState();
  const [projectState, projectDispatch] = useProjectState();

  return (
    <projectContext.Provider value={{ projectState, projectDispatch }}>
      <miradorContext.Provider value={{ miradorState, miradorDispatch }}>
        {props.children}
      </miradorContext.Provider>
    </projectContext.Provider>
  );
};
