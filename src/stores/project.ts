import {create, StateCreator} from "zustand";
import {ProjectConfig} from "../model/ProjectConfig";
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
  const labels = labelsSelector(state);
  return (key: keyof Labels) => labels?.[key] ?? key;
}

/**
 * {@link translateSelector} without type safety
 * allowing a project to provide translations
 * for custom elements like facets and custom components
 */
export function translateProjectSelector(state: ProjectConfigSlice) {
  const labels = labelsSelector(state);
  return (key: string) => labels?.[key] ?? key;
}

function labelsSelector(state: ProjectConfigSlice): Record<string, string> {
  const config = projectConfigSelector(state);
  let selectedLanguage = config.selectedLanguage;
  const translation = config.languages.find(l => l.code === selectedLanguage);
  if(!translation) {
    throw new Error(`No translation found for selected language ${selectedLanguage}`);
  }
  return translation.labels;
}

export function projectConfigSelector(state: ProjectConfigSlice): ProjectConfig {
  if(!state.projectConfig) {
    throw new Error('No project config');
  }
  return state.projectConfig;
}
