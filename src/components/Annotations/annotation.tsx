import React from "react";
import styled from "styled-components";
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
  min-width: 400px;
  height: 800px;
  padding: 0.7em;
  overflow: auto;
  white-space: pre-wrap;
`;

const ButtonsStyled = styled.div`
  display: flex;
`;

export function Annotation() {
  const [loading, setLoading] = React.useState(false);
  const annotations = useAnnotationStore((state) => state.annotations);
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const canvas = useMiradorStore((state) => state.canvas);
  const miradorStore = useMiradorStore((state) => state.miradorStore);

  React.useEffect(() => {
    if (!canvas && !annotations && !miradorStore && !projectConfig) return;
    visualizeAnnosMirador(
      annotations,
      miradorStore,
      canvas.canvasIds[0],
      projectConfig
    );
  }, [annotations, canvas, miradorStore, projectConfig]);

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

  return (
    <AnnotationStyled id="annotation">
      <ButtonsStyled>
        <AnnotationButtons /> {"|"}{" "}
        <AnnotationFilter loading={loadingHandler} />
      </ButtonsStyled>
      <AnnotationLinks />
      {annotations && annotations.length > 0 && !loading
        ? annotations.map((annotation, index) => (
            <AnnotationItem
              key={index}
              annot_id={index}
              annotation={annotation}
            />
          ))
        : null}
      {loading ? <Loading /> : null}
    </AnnotationStyled>
  );
}
