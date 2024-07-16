import { miradorImageToolsPlugin } from "mirador-image-tools/es";
import mirador from "mirador-knaw-huc-mui5";
import React from "react";
import { iiifAnn } from "../../model/AnnoRepoAnnotation";
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
  const setMiradorStore = useMiradorStore((state) => state.setStore);
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const projectConfig = useProjectStore(projectConfigSelector);
  const showSvgsAnnosMirador = useAnnotationStore(
    (state) => state.showSvgsAnnosMirador,
  );
  const miradorConfig = createMiradorConfig(
    props.broccoliResult,
    projectConfig,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderAnnosMirador(mirStore: any) {
    visualizeAnnosMirador(
      props.broccoliResult.anno,
      mirStore,
      props.broccoliResult.iiif.canvasIds[0],
      projectConfig,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function clearAnnosMirador(mirStore: any) {
    const iiifAnn: iiifAnn = {
      "@id": projectConfig.id,
      "@context": "http://iiif.io/api/presentation/2/context.json",
      "@type": "sc:AnnotationList",
      resources: [],
    };

    mirStore.dispatch(
      mirador.actions.receiveAnnotation(
        props.broccoliResult.iiif.canvasIds[0],
        "annotation",
        iiifAnn,
      ),
    );
  }

  React.useEffect(() => {
    const viewer = mirador.viewer(miradorConfig, [...miradorImageToolsPlugin]);
    setMiradorStore(viewer.store);

    const INIT_CHECK_INTERVAL_MS = 250;
    const MAX_INIT_ATTEMPTS = 80;
    let intervalCount = 0;

    /* 
    Hack to make sure that Mirador is actually initialised.
    Only after Mirador is initialised, TAV should interact with it.
    */
    function checkViewerInitialisation() {
      const state = viewer.store.getState();
      const isViewerInitialised: boolean | undefined =
        state.viewers[projectConfig.id]?.x &&
        typeof state.viewers[projectConfig.id].x === "number";

      if (isViewerInitialised) {
        performPostInitialisationActions();
        clearInterval(initialisationCheckInterval);
      } else if (intervalCount > MAX_INIT_ATTEMPTS) {
        clearInterval(initialisationCheckInterval);
      }
      intervalCount += 1;
    }

    function performPostInitialisationActions() {
      if (projectConfig.zoomAnnoMirador) {
        zoomAnnoMirador(props.broccoliResult, viewer.store, projectConfig);
      }

      if (showSvgsAnnosMirador && projectConfig.visualizeAnnosMirador) {
        renderAnnosMirador(viewer.store);
      }

      //Remove Mirador navigation buttons based on project config
      if (!projectConfig.showMiradorNavigationButtons) {
        const target = document.getElementsByClassName(
          "mirador-osd-navigation",
        );
        target[0].remove();
      }
    }

    const initialisationCheckInterval = setInterval(() => {
      checkViewerInitialisation();
    }, INIT_CHECK_INTERVAL_MS);

    return () => {
      clearInterval(initialisationCheckInterval);
    };
  }, [miradorConfig, projectConfig, props.broccoliResult]);

  React.useEffect(() => {
    if (!showSvgsAnnosMirador && miradorStore) {
      clearAnnosMirador(miradorStore);
    }

    if (showSvgsAnnosMirador && miradorStore) {
      renderAnnosMirador(miradorStore);
    }
  }, [showSvgsAnnosMirador]);

  return (
    <div
      id="mirador"
      className="bg-brand1Grey-50 sticky top-0 hidden h-[calc(100vh-79px)] w-7/12 grow self-stretch overflow-auto lg:flex"
    />
  );
}
