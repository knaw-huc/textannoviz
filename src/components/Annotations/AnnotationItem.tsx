import mirador from "mirador";
import React from "react";
import styled from "styled-components";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { useProjectStore } from "../../stores/project";
import { useTextStore } from "../../stores/text";
import { createIndices } from "../../utils/createIndices";
import { zoomAnnMirador } from "../../utils/zoomAnnMirador";
import { miradorConfig } from "../Mirador/MiradorConfig";
import { AnnotationItemContent } from "./AnnotationItemContent";

type AnnotationSnippetProps = {
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
  const text = useTextStore((state) => state.text);
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const canvas = useMiradorStore((state) => state.canvas);
  const updateOpenAnn = useAnnotationStore((state) => state.updateOpenAnn);
  const removeOpenAnn = useAnnotationStore((state) => state.removeOpenAnn);
  const setCurrentSelectedAnn = useAnnotationStore(
    (state) => state.setCurrentSelectedAnn
  );

  async function toggleOpen() {
    setOpen(!isOpen);

    if (!isOpen) {
      //Zoom in on annotation in Mirador
      const zoom = zoomAnnMirador(props.annotation, canvas.canvasIds[0]);

      miradorStore.dispatch(
        mirador.actions.selectAnnotation(
          miradorConfig.windows[0].id,
          props.annotation.id
        )
      );
      miradorStore.dispatch(
        mirador.actions.updateViewport(miradorConfig.windows[0].id, {
          x: zoom.zoomCenter.x,
          y: zoom.zoomCenter.y,
          zoom: 1 / zoom.miradorZoom,
        })
      );

      const startIndex = text.locations.annotations.find(
        (anno) => anno.bodyId === props.annotation.body.id
      ).start.line;

      const endIndex = text.locations.annotations.find(
        (anno) => anno.bodyId === props.annotation.body.id
      ).end.line;

      const indices = createIndices(startIndex, endIndex);

      setCurrentSelectedAnn(props.annotation.body.id);

      updateOpenAnn(props.annotation.body.id, indices);
    } else {
      miradorStore.dispatch(
        mirador.actions.deselectAnnotation(
          miradorConfig.windows[0].id,
          props.annotation.id
        )
      );
      removeOpenAnn(props.annotation.body.id);
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
        {projectConfig.renderAnnotationItem(props.annotation)}
      </Clickable>
      {isOpen && <AnnotationItemContent annotation={props.annotation} />}
    </AnnSnippet>
  );
}
