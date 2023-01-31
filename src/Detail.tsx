import mirador from "mirador";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  fetchBroccoliOpening,
  fetchBroccoliResolution,
} from "./backend/utils/fetchBroccoli";
import { visualizeAnnosMirador } from "./backend/utils/visualizeAnnosMirador";
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
  const { volumeNum, openingNum, resolutionId } = useParams<{
    volumeNum: string;
    openingNum: string;
    resolutionId: string;
  }>();

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
        volumeId: (broccoli.request as OpeningRequest).volumeId,
        openingNr: (broccoli.request as OpeningRequest).openingNr,
      },
    });

    setAnnos(broccoli.anno);
    setText(broccoli.text);
  }, []);

  React.useEffect(() => {
    if (volumeNum && openingNum) {
      fetchBroccoliOpening(volumeNum, openingNum)
        .then((broccoli) => {
          setState(broccoli);
        })
        .catch(console.error);
    }
  }, [volumeNum, openingNum, setState]);

  React.useEffect(() => {
    if (resolutionId) {
      fetchBroccoliResolution(resolutionId)
        .then((broccoli) => {
          setState(broccoli);
        })
        .catch(console.error);
    }
  }, [resolutionId, setState]);

  return (
    <AppContainer id="appcontainer">
      <LastUpdated>Last updated: 17 januari 2023</LastUpdated>
      <Row id="row">
        <Mirador />
        <Text text={text} />
        <Annotation annos={annos} />
      </Row>
    </AppContainer>
  );
};
