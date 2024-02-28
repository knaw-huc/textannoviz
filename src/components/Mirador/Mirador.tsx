import mirador from "mirador";
import React from "react";
import { Broccoli } from "../../model/Broccoli";
import { MiradorConfig } from "../../model/MiradorConfig";
import { ProjectConfig } from "../../model/ProjectConfig";
import { useMiradorStore } from "../../stores/mirador";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { defaultMiradorConfig } from "./defaultMiradorConfig";
import { zoomAnnoMirador } from "./zoomAnnoMirador";

type MiradorProps = {
  broccoliResult: Broccoli;
};

const createMiradorConfig = (
  broccoli: Broccoli,
  project: ProjectConfig,
  config: MiradorConfig = defaultMiradorConfig,
) => {
  const newConfig = config;
  newConfig.windows[0].manifestId = broccoli.iiif.manifest;
  newConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0];
  newConfig.windows[0].id = project.id;
  newConfig.window.allowWindowSideBar = project.mirador.showWindowSideBar;
  newConfig.window.allowTopMenuButton = project.mirador.showTopMenuButton;
  return newConfig;
};

export function Mirador(props: MiradorProps) {
  const setMiradorStore = useMiradorStore((state) => state.setStore);
  const projectConfig = useProjectStore(projectConfigSelector);
  const miradorConfig = createMiradorConfig(
    props.broccoliResult,
    projectConfig,
  );

  React.useEffect(() => {
    const viewer = mirador.viewer(miradorConfig);
    setMiradorStore(viewer.store);

    //Hack to make sure that Mirador is actually initialised
    const id = setInterval(() => {
      if (
        viewer.store.getState().viewers[projectConfig.id]?.x &&
        typeof viewer.store.getState().viewers[projectConfig.id].x === "number"
      ) {
        if (projectConfig.zoomAnnoMirador) {
          zoomAnnoMirador(props.broccoliResult, viewer.store, projectConfig);
        }
        clearInterval(id);
      }
    }, 250);
  }, [miradorConfig]);

  return (
    <div
      id="mirador"
      className="bg-brand1Grey-50 sticky top-0 hidden h-[calc(100vh-79px)] w-7/12 grow self-stretch overflow-auto lg:flex"
    ></div>
  );
}
