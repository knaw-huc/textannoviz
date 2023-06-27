import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ProjectConfig } from "../../model/ProjectConfig";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { useProjectStore } from "../../stores/project";
import { Loading } from "../../utils/Loader";
import { visualizeAnnosMirador } from "../../utils/visualizeAnnosMirador";
import { AnnotationButtons } from "./AnnotationButtons";
import { AnnotationFilter } from "./AnnotationFilter";
import { AnnotationItem } from "./AnnotationItem";
import { AnnotationLinks } from "./AnnotationLinks";

const AnnotationStyled = styled.div`
  width: 20%;
  height: 850px;
  padding: 0.7em;
  overflow: auto;
  white-space: pre-wrap;
  align-self: stretch;
  flex-grow: 1;
  position: relative;
`;

const ButtonsStyled = styled.div`
  display: flex;
`;

export function Annotation() {
  const [loading, setLoading] = React.useState(false);
  const [nextOrPrevButtonClicked, setNextOrPrevButtonClicked] =
    React.useState(false);
  const annotations = useAnnotationStore((state) => state.annotations);
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const projectName = useProjectStore((state) => state.projectName);
  const canvas = useMiradorStore((state) => state.canvas);
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const params = useParams();

  React.useEffect(() => {
    if (
      canvas &&
      annotations &&
      miradorStore &&
      projectConfig &&
      projectName !== "mondriaan"
    ) {
      visualizeAnnosMirador(
        annotations,
        miradorStore,
        canvas.canvasIds[0],
        projectConfig as ProjectConfig
      );
    }
  }, [annotations, canvas, miradorStore, projectConfig, projectName]);

  React.useEffect(() => {
    if (!annotations) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [annotations]);

  const loadingHandler = (bool: boolean) => {
    setLoading(bool);
  };

  const nextOrPrevButtonClickedHandler = (clicked: boolean) => {
    setNextOrPrevButtonClicked(clicked);
    return clicked;
  };

  React.useEffect(() => {
    if (params.tier0 && params.tier1) {
      setNextOrPrevButtonClicked(false);
    }
  }, [params.tier0, params.tier1]);

  return (
    <AnnotationStyled id="annotation">
      <AnnotationLinks />
      <ButtonsStyled>
        <AnnotationButtons
          nextOrPrevButtonClicked={nextOrPrevButtonClickedHandler}
        />{" "}
        {/* {params.tier0 && params.tier1 ? (
          <AnnotationFilter loading={loadingHandler} />
        ) : null} */}
        <AnnotationFilter loading={loadingHandler} />
      </ButtonsStyled>
      {annotations?.length > 0 && !loading
        ? annotations.map((annotation, index) => (
            <AnnotationItem
              key={index}
              annotation={annotation}
              nextOrPrevButtonClicked={nextOrPrevButtonClicked}
            />
          ))
        : null}
      {loading ? <Loading /> : null}
    </AnnotationStyled>
  );
}
