import mirador from "mirador";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Annotation } from "./components/Annotations/annotation";
import { Mirador } from "./components/Mirador/Mirador";
import { miradorConfig } from "./components/Mirador/MiradorConfig";
import { Text } from "./components/Text/text";
import { AnnoRepoAnnotation } from "./model/AnnoRepoAnnotation";
import { BroccoliText, BroccoliV3, OpeningRequest } from "./model/Broccoli";
import { ProjectConfig } from "./model/ProjectConfig";
import { MIRADOR_ACTIONS } from "./state/mirador/MiradorActions";
import { miradorContext } from "./state/mirador/MiradorContext";
import { PROJECT_ACTIONS } from "./state/project/ProjectAction";
import { projectContext } from "./state/project/ProjectContext";
import { fetchBroccoliBodyId, fetchBroccoliScan } from "./utils/fetchBroccoli";
import { visualizeAnnosMirador } from "./utils/visualizeAnnosMirador";

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
  const [annos, setAnnos] = React.useState<AnnoRepoAnnotation[]>([]);
  const [text, setText] = React.useState<BroccoliText>(null);
  const { miradorDispatch } = React.useContext(miradorContext);
  const { projectDispatch } = React.useContext(projectContext);
  const params = useParams();

  const setState = React.useCallback((broccoli: BroccoliV3) => {
    console.log(broccoli);
    setMiradorConfig(broccoli, props.project);
    const viewer = mirador.viewer(miradorConfig);

    miradorDispatch({
      type: MIRADOR_ACTIONS.SET_STORE,
      store: viewer.store,
    });

    projectDispatch({
      type: PROJECT_ACTIONS.SET_PROJECT,
      project: props.project,
    });

    projectDispatch({
      type: PROJECT_ACTIONS.SET_CONFIG,
      config: props.config,
    });

    visualizeAnnosMirador(
      broccoli,
      viewer.store,
      broccoli.iiif.canvasIds[0],
      props.config
    );

    miradorDispatch({
      type: MIRADOR_ACTIONS.SET_CANVAS,
      canvas: {
        canvasIds: broccoli.iiif.canvasIds,
        currentIndex: 0,
      },
    });

    miradorDispatch({
      type: MIRADOR_ACTIONS.SET_CURRENTCONTEXT,
      currentContext: {
        tier0: (broccoli.request as OpeningRequest).tier0,
        tier1: (broccoli.request as OpeningRequest).tier1,
      },
    });

    setAnnos(broccoli.anno);
    setText(broccoli.text);
  }, []);

  React.useEffect(() => {
    if (params.tier0 && params.tier1) {
      fetchBroccoliScan(params.tier0, params.tier1, props.config)
        .then((broccoli) => {
          setState(broccoli);
        })
        .catch(console.error);
    }
  }, [params.tier0, params.tier1, setState]);

  React.useEffect(() => {
    if (params.tier2) {
      fetchBroccoliBodyId(params.tier2, props.config)
        .then((broccoli) => {
          setState(broccoli);
        })
        .catch(console.error);
    }
  }, [params.tier2, setState]);

  return (
    <AppContainer id="appcontainer">
      <LastUpdated>Last updated: 14 February 2023</LastUpdated>
      <Row id="row">
        <Mirador />
        <Text text={text} />
        <Annotation annos={annos} />
      </Row>
    </AppContainer>
  );
};
