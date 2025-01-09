import mirador from "mirador";
import React from "react";
import { iiifAnn } from "../../model/AnnoRepoAnnotation";
import { Iiif } from "../../model/Broccoli";
import { MiradorConfig } from "../../model/MiradorConfig";
import { ProjectConfig } from "../../model/ProjectConfig";
import { useAnnotationStore } from "../../stores/annotation";
import { useInternalMiradorStore } from "../../stores/internal-mirador.ts";
import { miradorSelector, useMiradorStore } from "../../stores/mirador.ts";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { visualizeAnnosMirador } from "../../utils/visualizeAnnosMirador";
import { defaultMiradorConfig } from "./defaultMiradorConfig";
import { zoomAnnoMirador } from "./zoomAnnoMirador";

export function Mirador() {
  const { annotations } = useAnnotationStore();
  const { iiif, bodyId } = useMiradorStore(miradorSelector);

  const setInternalMiradorStore = useInternalMiradorStore(
    (state) => state.setStore,
  );
  const miradorStore = useInternalMiradorStore((state) => state.miradorStore);
  const projectConfig = useProjectStore(projectConfigSelector);
  const showSvgsAnnosMirador = useAnnotationStore(
    (state) => state.showSvgsAnnosMirador,
  );
  const miradorConfig = createMiradorConfig(iiif, projectConfig);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderAnnosMirador(mirStore: any) {
    visualizeAnnosMirador(
      annotations,
      mirStore,
      iiif.canvasIds[0],
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
        iiif.canvasIds[0],
        "annotation",
        iiifAnn,
      ),
    );
  }

  React.useEffect(() => {
    console.log("MIRADOR EFFECT");
    const viewer = mirador.viewer(miradorConfig);
    setInternalMiradorStore(viewer.store);

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
        zoomAnnoMirador(bodyId, annotations, iiif, viewer.store, projectConfig);
      }

      if (showSvgsAnnosMirador && projectConfig.visualizeAnnosMirador) {
        renderAnnosMirador(viewer.store);
      }

      //Remove Mirador navigation buttons based on project config
      if (!projectConfig.showMiradorNavigationButtons) {
        const target = document.getElementsByClassName(
          "mirador-osd-navigation",
        );
        target[0]?.remove();
      }
    }

    const initialisationCheckInterval = setInterval(() => {
      checkViewerInitialisation();
    }, INIT_CHECK_INTERVAL_MS);

    return () => {
      clearInterval(initialisationCheckInterval);
    };
  }, [miradorConfig, projectConfig, bodyId]);

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
      className="bg-brand1Grey-50 sticky top-0 hidden h-[calc(100vh-100px)] w-7/12 grow self-stretch overflow-auto lg:flex"
    />
  );
}

const createMiradorConfig = (
  iiif: Iiif,
  project: ProjectConfig,
  config: MiradorConfig = defaultMiradorConfig,
) => {
  const newConfig = config;
  newConfig.windows[0].manifestId = iiif.manifest;
  newConfig.windows[0].canvasId = iiif.canvasIds[0];
  newConfig.windows[0].id = project.id;
  newConfig.window.allowWindowSideBar = project.mirador.showWindowSideBar;
  newConfig.window.allowTopMenuButton = project.mirador.showTopMenuButton;
  return newConfig;
};
