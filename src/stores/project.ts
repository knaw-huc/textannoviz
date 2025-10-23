import { create, StateCreator } from "zustand";
import { Labels } from "../model/Labels.ts";
import { ProjectConfig } from "../model/ProjectConfig";
import { LanguageCode } from "../model/Language.ts";

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

//TODO: move to separate store?
export type InterfaceLanguageSlice = {
  interfaceLanguage: LanguageCode;
  setInterfaceLanguage: (newInterfaceLanguage: LanguageCode) => void;
};

export type ProjectStore = ProjectSlice &
  ProjectConfigSlice &
  InterfaceLanguageSlice;

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

const createInterfaceLanguageSlice: StateCreator<
  ProjectStore,
  [],
  [],
  InterfaceLanguageSlice
> = (set) => ({
  interfaceLanguage: "nl",
  setInterfaceLanguage: (newInterfaceLanguage) =>
    set(() => ({ interfaceLanguage: newInterfaceLanguage })),
});

export const useProjectStore = create<ProjectStore>()((...a) => ({
  ...createProjectSlice(...a),
  ...createProjectConfigSlice(...a),
  ...createInterfaceLanguageSlice(...a),
}));

export function translateSelector(state: ProjectStore) {
  const labels = labelsSelector(state);
  return (key: keyof Labels) => labels?.[key] ?? key;
}

/**
 * {@link translateSelector} without type safety
 * allowing a project to provide translations
 * for custom elements like facets and custom components
 */
export function translateProjectSelector(state: ProjectStore) {
  const labels = labelsSelector(state);
  return (key: string) => labels?.[key] ?? key;
}

function labelsSelector(state: ProjectStore): Record<string, string> {
  const config = projectConfigSelector(state);
  const { interfaceLanguage } = state;

  const translation = config.languages.find(
    (l) => l.code === interfaceLanguage,
  );

  if (!translation) {
    throw new Error(
      `No translation found for selected language ${interfaceLanguage}`,
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
