import { create, StateCreator } from "zustand";
import { Labels } from "../model/Labels.ts";
import { ProjectConfig } from "../model/ProjectConfig";

export type ProjectSlice = {
  projectName: string;
  setProjectName: (newProjectName: ProjectSlice["projectName"]) => void;
};

export type ProjectConfigSlice = {
  projectConfig: ProjectConfig | undefined;
  setProjectConfig: (
    newProjectConfig: ProjectConfigSlice["projectConfig"],
  ) => void;
};

export type ProjectStore = ProjectSlice & ProjectConfigSlice;
const createProjectSlice: StateCreator<ProjectStore, [], [], ProjectSlice> = (
  set,
) => ({
  projectName: "",
  setProjectName: (newProjectName) =>
    set(() => {
      return { projectName: newProjectName };
    }),
});

const createProjectConfigSlice: StateCreator<
  ProjectStore,
  [],
  [],
  ProjectConfigSlice
> = (set) => ({
  projectConfig: undefined,
  setProjectConfig: (newProjectConfig) =>
    set(() => ({ projectConfig: newProjectConfig })),
});

export const useProjectStore = create<ProjectStore>()((...a) => ({
  ...createProjectSlice(...a),
  ...createProjectConfigSlice(...a),
}));

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
  const selectedLanguage = config.defaultLanguage;
  const translation = config.languages.find((l) => l.code === selectedLanguage);
  if (!translation) {
    throw new Error(
      `No translation found for selected language ${selectedLanguage}`,
    );
  }
  return translation.labels;
}

export function projectConfigSelector(
  state: ProjectConfigSlice,
): ProjectConfig {
  if (!state.projectConfig) {
    throw new Error("No project config");
  }
  return state.projectConfig;
}

export function setProjectConfigSelector(state: ProjectStore) {
  return state.setProjectConfig;
}
export function setProjectNameSelector(state: ProjectStore) {
  return state.setProjectName;
}

export function projectNameSelector(state: ProjectSlice): string {
  return state.projectName;
}
