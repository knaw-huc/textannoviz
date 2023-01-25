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
import { BroccoliV2, OpeningRequest } from "./model/Broccoli";
import { ANNOTATION_ACTIONS } from "./state/annotation/AnnotationActions";
import { annotationContext } from "./state/annotation/AnnotationContext";
import { MIRADOR_ACTIONS } from "./state/mirador/MiradorActions";
import { miradorContext } from "./state/mirador/MiradorContext";
import { PROJECT_ACTIONS } from "./state/project/ProjectAction";
import { projectContext } from "./state/project/ProjectContext";
import { TEXT_ACTIONS } from "./state/text/TextActions";
import { textContext } from "./state/text/TextContext";

interface DetailProps {
  project: string;
  config: any;
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

const setMiradorConfig = (broccoli: BroccoliV2, project: string) => {
  miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest;
  miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0];
  miradorConfig.id = project;
  miradorConfig.windows[0].id = project;
};

export const Detail = (props: DetailProps) => {
  const { miradorDispatch } = React.useContext(miradorContext);
  const { annotationDispatch } = React.useContext(annotationContext);
  const { textDispatch } = React.useContext(textContext);
  const { projectDispatch } = React.useContext(projectContext);
  const { volumeNum, openingNum, resolutionId } = useParams<{
    volumeNum: string;
    openingNum: string;
    resolutionId: string;
  }>();

  const setState = React.useCallback((broccoli: BroccoliV2) => {
    console.log(broccoli);
    setMiradorConfig(broccoli, props.project);
    const viewer = mirador.viewer(miradorConfig);

    projectDispatch({
      type: PROJECT_ACTIONS.SET_PROJECT,
      project: props.project,
    });

    projectDispatch({
      type: PROJECT_ACTIONS.SET_CONFIG,
      config: props.config,
    });

    miradorDispatch({
      type: MIRADOR_ACTIONS.SET_STORE,
      store: viewer.store,
    });

    const iiifAnns = visualizeAnnosMirador(
      broccoli,
      viewer.store,
      broccoli.iiif.canvasIds[0],
      props.config.colours,
      props.config.id
    );

    miradorDispatch({
      type: MIRADOR_ACTIONS.SET_MIRANN,
      mirAnn: iiifAnns,
    });

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

    annotationDispatch({
      type: ANNOTATION_ACTIONS.SET_ANNOTATION,
      annotation: broccoli.anno,
    });

    textDispatch({
      type: TEXT_ACTIONS.SET_TEXT,
      text: broccoli.text,
    });
  }, []);

  React.useEffect(() => {
    if (props.project === "republic") {
      if (volumeNum && openingNum) {
        fetchBroccoliOpening(volumeNum, openingNum)
          .then((broccoli) => {
            setState(broccoli);
          })
          .catch(console.error);
      }
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
        <Text />
        <Annotation />
      </Row>
    </AppContainer>
  );
};
