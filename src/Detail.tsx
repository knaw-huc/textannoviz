import mirador from "mirador";
import React from "react";
import { useParams } from "react-router-dom";
import { Annotation } from "./components/Annotations/annotation";
import { Mirador } from "./components/Mirador/Mirador";
import { miradorConfig } from "./components/Mirador/MiradorConfig";
import { TextComponent } from "./components/Text/TextComponent";
import { Broccoli, BroccoliBodyIdResult } from "./model/Broccoli";
import { ProjectConfig } from "./model/ProjectConfig";
import { useAnnotationStore } from "./stores/annotation";
import { useMiradorStore } from "./stores/mirador";
import { useProjectStore } from "./stores/project";
import { useTextStore } from "./stores/text";
import {
  fetchBroccoliBodyId,
  fetchBroccoliBodyIdOfScan,
  fetchBroccoliScanWithOverlap,
} from "./utils/broccoli";

interface DetailProps {
  project: string;
  config: ProjectConfig;
}

const setMiradorConfig = (broccoli: Broccoli, project: string) => {
  miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest;
  miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0];
  miradorConfig.windows[0].id = project;
};

export const Detail = (props: DetailProps) => {
  const setText = useTextStore((state) => state.setText);
  const setProjectName = useProjectStore((state) => state.setProjectName);
  const setProjectConfig = useProjectStore((state) => state.setProjectConfig);
  const setStore = useMiradorStore((state) => state.setStore);
  const setCurrentContext = useMiradorStore((state) => state.setCurrentContext);
  const setCanvas = useMiradorStore((state) => state.setCanvas);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const annotationTypesToInclude = useAnnotationStore(
    (state) => state.annotationTypesToInclude
  );
  const params = useParams();

  const setState = React.useCallback(
    (broccoli: Broccoli, currentBodyId: string) => {
      setMiradorConfig(broccoli, props.project);
      console.log(broccoli);
      const viewer = mirador.viewer(miradorConfig);

      setStore(viewer.store);

      setProjectName(props.project);
      setProjectConfig(props.config);

      const newCanvas = {
        canvasIds: broccoli.iiif.canvasIds,
        currentIndex: 0,
      };

      setCanvas(newCanvas);

      const newCurrentContext = {
        tier0: params.tier0 as string,
        tier1: params.tier1 as string,
        bodyId: currentBodyId,
      };

      setCurrentContext(newCurrentContext);

      setAnnotations(broccoli.anno);
      setText(broccoli.text);
    },
    [
      params.tier0,
      params.tier1,
      props.config,
      props.project,
      setAnnotations,
      setCanvas,
      setCurrentContext,
      setProjectConfig,
      setProjectName,
      setStore,
      setText,
    ]
  );

  React.useEffect(() => {
    let ignore = false;
    if (params.tier0 && params.tier1) {
      fetchBroccoliBodyIdOfScan(params.tier0, params.tier1, props.config).then(
        (result: BroccoliBodyIdResult) => {
          if (!ignore) {
            const bodyId = result.bodyId;
            const includeResults = ["anno", "text", "iiif"];
            const overlapTypes = annotationTypesToInclude;
            fetchBroccoliScanWithOverlap(
              result.bodyId,
              overlapTypes,
              includeResults,
              props.config
            ).then((broccoli: Broccoli) => {
              setState(broccoli, bodyId);
            });
          }
        }
      );
    }
    return () => {
      ignore = true;
    };
  }, [
    annotationTypesToInclude,
    params.tier0,
    params.tier1,
    props.config,
    setState,
  ]);

  React.useEffect(() => {
    if (params.tier2) {
      fetchBroccoliBodyId(params.tier2, props.config)
        .then((broccoli: Broccoli) => {
          const bodyId = broccoli.request.bodyId;
          setState(broccoli, bodyId);
        })
        .catch(console.error);
    }
  }, [params.tier2, props.config, setState]);

  return (
    <div className="appContainer">
      <div className="lastUpdated">Last updated: 30 May 2023</div>
      <div className="row">
        <Mirador />
        <TextComponent panels={["textNL", "textEN"]} />
        <Annotation />
      </div>
    </div>
  );
};
