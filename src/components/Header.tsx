import { projectConfigSelector, useProjectStore } from "../stores/project.ts";

export const Header = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  return <projectConfig.components.Header />;
};
