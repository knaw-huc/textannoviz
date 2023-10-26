import { create, StateCreator } from "zustand";
import { ProjectConfig } from "../model/ProjectConfig";
import {Labels} from "../model/Labels.ts";

export interface ProjectSlice {
  projectName: string;
  setProjectName: (newProjectName: ProjectSlice["projectName"]) => void;
}

export interface ProjectConfigSlice {
  projectConfig: ProjectConfig | undefined;
  setProjectConfig: (
    newProjectConfig: ProjectConfigSlice["projectConfig"],
  ) => void;
}

const createProjectSlice: StateCreator<
  ProjectSlice & ProjectConfigSlice,
  [],
  [],
  ProjectSlice
> = (set) => ({
  projectName: "",
  setProjectName: (newProjectName) =>
    set(() => ({ projectName: newProjectName })),
});

const createProjectConfigSlice: StateCreator<
  ProjectSlice & ProjectConfigSlice,
  [],
  [],
  ProjectConfigSlice
> = (set) => ({
  projectConfig: undefined,
  setProjectConfig: (newProjectConfig) =>
    set(() => ({ projectConfig: newProjectConfig })),
});

export const useProjectStore = create<ProjectSlice & ProjectConfigSlice>()(
  (...a) => ({
    ...createProjectSlice(...a),
    ...createProjectConfigSlice(...a),
  }),
);

export function translateSelector(state: ProjectConfigSlice) {
  const labels = projectConfigSelector(state).labels;
  return (key: keyof Labels) => labels?.[key] ?? key;
}

export function projectConfigSelector(state: ProjectConfigSlice): ProjectConfig {
  if(!state.projectConfig) {
    throw new Error('No project config');
  }
  return state.projectConfig;
}