import mirador from "mirador";
import React from "react";
import { Broccoli } from "../../model/Broccoli";
import { MiradorConfig } from "../../model/MiradorConfig";
import { ProjectConfig } from "../../model/ProjectConfig";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { visualizeAnnosMirador } from "../../utils/visualizeAnnosMirador";
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
  const [intervalId, setIntervalId] = React.useState<NodeJS.Timer | null>(null);
  const setMiradorStore = useMiradorStore((state) => state.setStore);
  const projectConfig = useProjectStore(projectConfigSelector);
  const showSvgsAnnosMirador = useAnnotationStore(
    (state) => state.showSvgsAnnosMirador,
  );
  const miradorConfig = createMiradorConfig(
    props.broccoliResult,
    projectConfig,
  );

  React.useEffect(() => {
    const viewer = mirador.viewer(miradorConfig);
    setMiradorStore(viewer.store);

    let intervalCount = 0;

    /* 
    Hack to make sure that Mirador is actually initialised.
    Only after Mirador is initialised, TAV should interact with it.
    */
    const id = setInterval(() => {
      intervalCount += 1;
      if (
        viewer.store.getState().viewers[projectConfig.id]?.x &&
        typeof viewer.store.getState().viewers[projectConfig.id].x === "number"
      ) {
        if (projectConfig.zoomAnnoMirador) {
          zoomAnnoMirador(props.broccoliResult, viewer.store, projectConfig);
        }

        if (showSvgsAnnosMirador && projectConfig.visualizeAnnosMirador) {
          visualizeAnnosMirador(
            props.broccoliResult.anno,
            viewer.store,
            props.broccoliResult.iiif.canvasIds[0],
            projectConfig,
          );
        }

        clearInterval(id);
        setIntervalId((prevId) => {
          if (prevId !== null) {
            clearInterval(prevId);
          }
          return null;
        });
      }

      if (intervalCount > 80) {
        clearInterval(id);
      }
    }, 250);

    setIntervalId((prevId) => (prevId !== null ? prevId : id));

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [miradorConfig]);

  return (
    <div
      id="mirador"
      className="bg-brand1Grey-50 sticky top-0 hidden h-[calc(100vh-79px)] w-7/12 grow self-stretch overflow-auto lg:flex"
    ></div>
  );
}
