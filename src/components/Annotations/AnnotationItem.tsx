import mirador from "mirador";
import React from "react";
import styled from "styled-components";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { ANNOTATION_ACTIONS } from "../../state/annotation/AnnotationActions";
import { annotationContext } from "../../state/annotation/AnnotationContext";
import { useSelectedAnn } from "../../state/annotation/AnnotationReducer";
import { miradorContext } from "../../state/mirador/MiradorContext";
import { projectContext } from "../../state/project/ProjectContext";
import { zoomAnnMirador } from "../../utils/zoomAnnMirador";
import { miradorConfig } from "../Mirador/MiradorConfig";
import { AnnotationItemContent } from "./AnnotationItemContent";

type AnnotationSnippetProps = {
  annot_id: React.Key;
  annotation: AnnoRepoAnnotation;
};

const AnnSnippet = styled.div`
  margin: 5px 0;
  padding: 10px;
  border-style: solid;
  border-color: darkgray;
  border-width: 1px;
`;

const Clickable = styled.div`
  cursor: pointer;
  font-weight: bold;
  user-select: none;
  &:hover {
    text-decoration: underline;
  }
`;

export function AnnotationItem(props: AnnotationSnippetProps) {
  const [isOpen, setOpen] = React.useState(false);
  const { miradorState } = React.useContext(miradorContext);
  const { projectState } = React.useContext(projectContext);
  const { annotationDispatch } = React.useContext(annotationContext);
  const selectedAnn = useSelectedAnn((state) => state.selectedAnn);
  const updateSelectedAnn = useSelectedAnn((state) => state.updateSelectedAnn);
  const removeSelectedAnn = useSelectedAnn((state) => state.removeSelectedAnn);

  console.log(selectedAnn);

  function toggleOpen() {
    setOpen(!isOpen);

    if (!isOpen) {
      //Zoom in on annotation in Mirador
      const zoom = zoomAnnMirador(
        props.annotation,
        miradorState.canvas.canvasIds[0]
      );

      miradorState.store.dispatch(
        mirador.actions.selectAnnotation(
          miradorConfig.windows[0].id,
          props.annotation.id
        )
      );
      miradorState.store.dispatch(
        mirador.actions.updateViewport(miradorConfig.windows[0].id, {
          x: zoom.zoomCenter.x,
          y: zoom.zoomCenter.y,
          zoom: 1 / zoom.miradorZoom,
        })
      );
      updateSelectedAnn(props.annotation.body.id);

      annotationDispatch({
        type: ANNOTATION_ACTIONS.SET_ANNOTATIONITEMOPEN,
        annotationItemOpen: true,
      });
    } else {
      miradorState.store.dispatch(
        mirador.actions.deselectAnnotation(
          miradorConfig.windows[0].id,
          props.annotation.id
        )
      );
      annotationDispatch({
        type: ANNOTATION_ACTIONS.SET_ANNOTATIONITEMOPEN,
        annotationItemOpen: false,
      });
      removeSelectedAnn(props.annotation.body.id);
    }
  }

  /**
   * The next two functions might be performance intensive, especially for mobile users.
   * TODO: check performance of both functions
   */

  // function selectAnn() {
  //     state.store.dispatch(mirador.actions.selectAnnotation("republic", props.annotation.id))
  // }

  // function deselectAnn() {
  //     state.store.dispatch(mirador.actions.deselectAnnotation("republic", props.annotation.id))
  // }

  return (
    <AnnSnippet id="annotation-snippet">
      <Clickable onClick={toggleOpen} id="clickable">
        {projectState.config.renderAnnotationItem(props.annotation)}
      </Clickable>
      {isOpen && <AnnotationItemContent annotation={props.annotation} />}
    </AnnSnippet>
  );
}
