import mirador from "mirador";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Annotation } from "./components/Annotations/annotation";
import { Mirador } from "./components/Mirador/Mirador";
import { miradorConfig } from "./components/Mirador/MiradorConfig";
import { Text } from "./components/Text/text";
import { BroccoliTextV3, BroccoliV3, OpeningRequest } from "./model/Broccoli";
import { ProjectConfig } from "./model/ProjectConfig";
import { useAnnotationStore } from "./stores/annotation";
import { useMiradorStore } from "./stores/mirador";
import { useProjectStore } from "./stores/project";
import { fetchBroccoliBodyId, fetchBroccoliScan } from "./utils/fetchBroccoli";

interface DetailProps {
  project: string;
  config: ProjectConfig;
}

const AppContainer = styled.div`
  border-style: solid;
  border-color: black;
  border-width: 2px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const LastUpdated = styled.div`
  border-bottom: 1px solid black;
`;

const setMiradorConfig = (broccoli: BroccoliV3, project: string) => {
  miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest;
  miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0];
  miradorConfig.windows[0].id = project;
};

export const Detail = (props: DetailProps) => {
  const [text, setText] = React.useState<BroccoliTextV3>(null);
  const setProjectName = useProjectStore((state) => state.setProjectName);
  const setProjectConfig = useProjectStore((state) => state.setProjectConfig);
  const setStore = useMiradorStore((state) => state.setStore);
  const setCurrentContext = useMiradorStore((state) => state.setCurrentContext);
  const setCanvas = useMiradorStore((state) => state.setCanvas);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const params = useParams();

  const setState = React.useCallback(
    (broccoli: BroccoliV3) => {
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
        tier0: (broccoli.request as OpeningRequest).tier0,
        tier1: (broccoli.request as OpeningRequest).tier1,
      };

      setCurrentContext(newCurrentContext);

      setAnnotations(broccoli.anno);
      setText(broccoli.text as BroccoliTextV3);
    },
    [
      props.config,
      props.project,
      setAnnotations,
      setCanvas,
      setCurrentContext,
      setProjectConfig,
      setProjectName,
      setStore,
    ]
  );

  React.useEffect(() => {
    if (params.tier0 && params.tier1) {
      fetchBroccoliScan(
        params.tier0,
        params.tier1,
        props.config,
        props.config.annotationTypesToInclude
      )
        .then((broccoli) => {
          setState(broccoli);
        })
        .catch(console.error);
    }
  }, [params.tier0, params.tier1, props.config, setState]);

  React.useEffect(() => {
    if (params.tier2) {
      fetchBroccoliBodyId(params.tier2, props.config)
        .then((broccoli) => {
          setState(broccoli);
        })
        .catch(console.error);
    }
  }, [params.tier2, props.config, setState]);

  return (
    <AppContainer id="appcontainer">
      <LastUpdated>Last updated: 14 February 2023</LastUpdated>
      <Row id="row">
        <Mirador />
        <Text text={text} />
        <Annotation />
      </Row>
    </AppContainer>
  );
};
