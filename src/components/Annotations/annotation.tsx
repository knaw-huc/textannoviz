import React from "react";
import styled from "styled-components";
import { Loading } from "../../backend/utils/Loader";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { ANNOTATION_ACTIONS } from "../../state/annotation/AnnotationActions";
import { annotationContext } from "../../state/annotation/AnnotationContext";
import { AnnotationButtons } from "./AnnotationButtons";
import { AnnotationItem } from "./AnnotationItem";
import { AnnotationLinks } from "./AnnotationLinks";

const AnnotationStyled = styled.div`
  min-width: 400px;
  height: 800px;
  padding: 0.7em;
  overflow: auto;
  white-space: pre-wrap;
`;

export function Annotation() {
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

      {annotationState.annotation && annotationState.annotation.length > 0 ? (
        annotationState.annotation.map((annotation, index) => (
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
