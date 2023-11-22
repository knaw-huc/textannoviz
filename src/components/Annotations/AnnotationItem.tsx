import mirador from "mirador";
import React from "react";
import styled from "styled-components";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useTextStore } from "../../stores/text";
import { createIndices } from "../../utils/createIndices";
import { zoomAnnMirador } from "../../utils/zoomAnnMirador";
import { AnnotationItemContent } from "./AnnotationItemContent";

type AnnotationSnippetProps = {
  annotation: AnnoRepoAnnotation;
  nextOrPrevButtonClicked: boolean;
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
  const views = useTextStore((state) => state.views);
  const projectConfig = useProjectStore(projectConfigSelector);
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const canvas = useMiradorStore((state) => state.canvas);
  const updateOpenAnn = useAnnotationStore((state) => state.updateOpenAnn);
  const removeOpenAnn = useAnnotationStore((state) => state.removeOpenAnn);
  const setCurrentSelectedAnn = useAnnotationStore(
    (state) => state.setCurrentSelectedAnn,
  );

  React.useEffect(() => {
    if (props.nextOrPrevButtonClicked === true) {
      setOpen(false);
    }
  }, [props.nextOrPrevButtonClicked]);

  async function toggleOpen() {
    setOpen(!isOpen);

    if (!isOpen) {
      //Zoom in on annotation in Mirador
      const zoom = zoomAnnMirador(props.annotation, canvas.canvasIds[0]);

      if (zoom !== null) {
        miradorStore.dispatch(
          mirador.actions.selectAnnotation(
            miradorStore.windows[0].id,
            props.annotation.id,
          ),
        );
        miradorStore.dispatch(
          mirador.actions.updateViewport(miradorStore.windows[0].id, {
            x: zoom.zoomCenter.x,
            y: zoom.zoomCenter.y,
            zoom: 1 / zoom.miradorZoom,
          }),
        );
      }

      if (views) {
        let startIndex = -1;
        let endIndex = -1;
        Object.values(views).map((view) => {
          const tempStartIndex = view.locations.annotations.find(
            (anno) => anno.bodyId === props.annotation.body.id,
          )?.start.line;

          if (tempStartIndex !== undefined) {
            startIndex = tempStartIndex;
          }

          const tempEndIndex = view.locations.annotations.find(
            (anno) => anno.bodyId === props.annotation.body.id,
          )?.end.line;

          if (tempEndIndex !== undefined) {
            endIndex = tempEndIndex;
          }
        });

        if (startIndex >= 0 && endIndex >= 0) {
          const indices = createIndices(startIndex, endIndex);
          updateOpenAnn(props.annotation.body.id, indices);
        }

        setCurrentSelectedAnn(props.annotation.body.id);
      }
    } else {
      miradorStore.dispatch(
        mirador.actions.deselectAnnotation(
          miradorStore.windows[0].id,
          props.annotation.id,
        ),
      );
      removeOpenAnn(props.annotation.body.id);
    }
  }

  /**
   * The next two functions might be performance intensive, especially for mobile users.
   * TODO: check performance of both functions
   */

  const selectAnn = () => {
    miradorStore.dispatch(
      mirador.actions.selectAnnotation(
        projectConfig.id,
        props.annotation.body.id,
      ),
    );
  };

  const deselectAnn = () => {
    miradorStore.dispatch(
      mirador.actions.deselectAnnotation(
        projectConfig.id,
        props.annotation.body.id,
      ),
    );
  };

  return (
    <AnnSnippet id="annotation-snippet">
      <Clickable
        onClick={toggleOpen}
        onMouseEnter={selectAnn}
        onMouseLeave={deselectAnn}
        id="clickable"
      >
        <projectConfig.components.AnnotationItem
          annotation={props.annotation}
        />
      </Clickable>
      {isOpen && <AnnotationItemContent annotation={props.annotation} />}
    </AnnSnippet>
  );
}
