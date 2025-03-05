import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { Panel } from "./Panel";

export const Panels = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  return (
    <>
      {projectConfig.panels.map((panel, index) => (
        <Panel key={index} tabsToRender={panel.tabs} panelName={panel.name} />
      ))}
    </>
  );
};
