import { create, StateCreator } from "zustand";
import { ProjectConfig } from "../model/ProjectConfig";

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
