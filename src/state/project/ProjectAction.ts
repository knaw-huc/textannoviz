import { ProjectState } from "./ProjectReducer";

export enum PROJECT_ACTIONS {
  SET_PROJECT = "SET_PROJECT",
  SET_CONFIG = "SET_CONFIG",
}

export type SetProject = Pick<ProjectState, "project"> & {
  type: PROJECT_ACTIONS.SET_PROJECT;
};

export type SetConfig = Pick<ProjectState, "config"> & {
  type: PROJECT_ACTIONS.SET_CONFIG;
};

export type ProjectAction = SetProject | SetConfig;
