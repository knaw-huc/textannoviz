import React from "react";
import { ProjectConfig } from "../../model/ProjectConfig";
import {
  ProjectAction,
  PROJECT_ACTIONS,
  SetConfig,
  SetProject,
} from "./ProjectAction";

export interface ProjectState {
  project: string;
  config: ProjectConfig;
}

export const initProjectState: ProjectState = {
  project: "",
  config: null,
};

export const useProjectState = (): [
  ProjectState,
  React.Dispatch<ProjectAction>
] => {
  const [state, dispatch] = React.useReducer(projectReducer, initProjectState);

  return [state, dispatch];
};

const projectReducer = (
  state: ProjectState,
  action: ProjectAction
): ProjectState => {
  console.log(action, state);

  switch (action.type) {
    case PROJECT_ACTIONS.SET_PROJECT:
      return setProject(state, action);
    case PROJECT_ACTIONS.SET_CONFIG:
      return setConfig(state, action);
    default:
      break;
  }

  return state;
};

const setProject = (state: ProjectState, action: SetProject) => {
  return {
    ...state,
    project: action.project,
  };
};

const setConfig = (state: ProjectState, action: SetConfig) => {
  return {
    ...state,
    config: action.config,
  };
};
