import { Skeleton } from "primereact/skeleton";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ProjectConfig } from "../../model/ProjectConfig";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { useProjectStore } from "../../stores/project";
import { visualizeAnnosMirador } from "../../utils/visualizeAnnosMirador";
import { AnnotationButtons } from "./AnnotationButtons";
import { AnnotationFilter } from "./AnnotationFilter";
import { AnnotationItem } from "./AnnotationItem";
import { AnnotationLinks } from "./AnnotationLinks";

type AnnotationProps = {
  isLoading: boolean;
};

const AnnotationStyled = styled.div`
  width: 30%;
  height: 900px;
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

export function Annotation(props: AnnotationProps) {
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
        <AnnotationFilter />
      </ButtonsStyled>
      <TabView>
        <TabPanel header="Metadata">
          {annotations.length > 0 && !props.isLoading ? (
            projectConfig?.renderMetadataPanel(annotations)
          ) : (
            <div>
              <Skeleton width="25rem" className="skeleton"></Skeleton>
              <Skeleton width="12.5rem" className="skeleton"></Skeleton>
              <Skeleton width="6.25rem" className="skeleton"></Skeleton>
            </div>
          )}
        </TabPanel>
        <TabPanel header="Web annotations">
          {annotations?.length > 0 && !props.isLoading ? (
            annotations.map((annotation, index) => (
              <AnnotationItem
                key={index}
                annotation={annotation}
                nextOrPrevButtonClicked={nextOrPrevButtonClicked}
              />
            ))
          ) : (
            <div>
              <Skeleton width="25rem" className="skeleton"></Skeleton>
              <Skeleton width="12.5rem" className="skeleton"></Skeleton>
              <Skeleton width="6.25rem" className="skeleton"></Skeleton>
            </div>
          )}
        </TabPanel>
      </TabView>
    </AnnotationStyled>
  );
}
