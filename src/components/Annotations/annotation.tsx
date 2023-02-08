import React from "react";
import styled from "styled-components";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { ANNOTATION_ACTIONS } from "../../state/annotation/AnnotationActions";
import { annotationContext } from "../../state/annotation/AnnotationContext";
import { Loading } from "../../utils/Loader";
import { AnnotationButtons } from "./AnnotationButtons";
import { AnnotationItem } from "./AnnotationItem";
import { AnnotationLinks } from "./AnnotationLinks";

interface AnnotationProps {
  annos: AnnoRepoAnnotation[];
}

const AnnotationStyled = styled.div`
  min-width: 400px;
  height: 800px;
  padding: 0.7em;
  overflow: auto;
  white-space: pre-wrap;
`;

export function Annotation(props: AnnotationProps) {
  const { annotationState, annotationDispatch } =
    React.useContext(annotationContext);

  function handleSelected(selected: AnnoRepoAnnotation | undefined) {
    console.log(selected);

    annotationDispatch({
      type: ANNOTATION_ACTIONS.SET_SELECTEDANNOTATION,
      selectedAnnotation: selected,
    });
  }

  return (
    <AnnotationStyled id="annotation">
      <AnnotationButtons />
      <AnnotationLinks />

      {props.annos && props.annos.length > 0 ? (
        props.annos.map((annotation, index) => (
          <AnnotationItem
            key={index}
            annot_id={index}
            annotation={annotation}
            selected={annotationState.selectedAnnotation?.id === annotation.id}
            onSelect={handleSelected}
          />
        ))
      ) : (
        <Loading />
      )}
    </AnnotationStyled>
  );
}
