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
import { TEXT_ACTIONS } from "./state/text/TextActions";
import { textContext } from "./state/text/TextContext";

const AppContainer = styled.div`
  border-style: solid;
  border-color: black;
  border-width: 2px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const setMiradorConfig = (broccoli: BroccoliV2) => {
  miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest;
  miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0];
};

export const Detail = () => {
  const { miradorState, miradorDispatch } = React.useContext(miradorContext);
  const { annotationState, annotationDispatch } =
    React.useContext(annotationContext);
  const { textState, textDispatch } = React.useContext(textContext);
  const { volumeNum, openingNum, resolutionId } = useParams<{
    volumeNum: string;
    openingNum: string;
    resolutionId: string;
  }>();

  const setState = React.useCallback((broccoli: BroccoliV2) => {
    console.log(broccoli);
    setMiradorConfig(broccoli);
    const viewer = mirador.viewer(miradorConfig);

    miradorDispatch({
      type: MIRADOR_ACTIONS.SET_STORE,
      store: viewer.store,
    });

    const iiifAnns = visualizeAnnosMirador(
      broccoli,
      viewer.store,
      broccoli.iiif.canvasIds[0]
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
      <Row id="row">
        <Mirador />
        <Text />
        <Annotation />
      </Row>
    </AppContainer>
  );
};
