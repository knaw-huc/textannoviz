import React from "react";
import styled from "styled-components";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
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
          />
        ))
      ) : (
        <Loading />
      )}
    </AnnotationStyled>
  );
}
