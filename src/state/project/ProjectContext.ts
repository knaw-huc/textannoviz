import React from "react";
import { ProjectAction } from "./ProjectAction";
import { initProjectState, ProjectState } from "./ProjectReducer";

interface ProjectContext {
  projectState: ProjectState;
  projectDispatch: React.Dispatch<ProjectAction>;
}

const initProjectContext: ProjectContext = {
  projectState: initProjectState,
  projectDispatch: null,
};

export const projectContext =
  React.createContext<ProjectContext>(initProjectContext);
