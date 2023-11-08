// import { TabPanel, TabView } from "primereact/tabview";
import { Skeleton } from "primereact/skeleton";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ProjectConfig } from "../../model/ProjectConfig";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project";
import { visualizeAnnosMirador } from "../../utils/visualizeAnnosMirador";
import { AnnotationFilter } from "./AnnotationFilter";
import { AnnotationItem } from "./AnnotationItem";

type AnnotationProps = {
  isLoading: boolean;
};

const ButtonsStyled = styled.div`
  display: flex;
`;

export function Annotation(props: AnnotationProps) {
  const [nextOrPrevButtonClicked, setNextOrPrevButtonClicked] =
    React.useState(false);
  const annotations = useAnnotationStore((state) => state.annotations);
  const projectConfig = useProjectStore(projectConfigSelector);
  const projectName = useProjectStore((state) => state.projectName);
  const canvas = useMiradorStore((state) => state.canvas);
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const params = useParams();
  const translate = useProjectStore(translateSelector);

  React.useEffect(() => {
    if (
      canvas.canvasIds.length > 0 &&
      annotations &&
      miradorStore &&
      projectConfig &&
      projectName !== "mondriaan"
    ) {
      visualizeAnnosMirador(
        annotations,
        miradorStore,
        canvas.canvasIds[0],
        projectConfig as ProjectConfig,
      );
    }
  }, [annotations, canvas, miradorStore, projectConfig, projectName]);

  React.useEffect(() => {
    if (params.tier0 && params.tier1) {
      setNextOrPrevButtonClicked(false);
    }
  }, [params.tier0, params.tier1]);

  return (
    <div className="border-brand1Grey-100 relative hidden w-3/12 grow self-stretch border-x md:block">
      <Tabs className="flex h-[calc(100vh-79px)] flex-col overflow-auto">
        <TabList
          aria-label="annotation-panel"
          className="border-brand1Grey-100 sticky top-0 flex w-full border-b bg-white text-sm text-neutral-600"
        >
          <Tab
            id="metadata"
            className="aria-selected:bg-brand1Grey-100 hover:bg-brand1Grey-50 px-4 py-2 outline-none transition-colors duration-200 hover:cursor-pointer"
          >
            {translate("METADATA")}
          </Tab>
          <Tab
            id="webannos"
            className="aria-selected:bg-brand1Grey-100 hover:bg-brand1Grey-50 px-4 py-2 outline-none transition-colors duration-200 hover:cursor-pointer"
          >
            {translate("WEB_ANNOTATIONS")}
          </Tab>
        </TabList>
        <TabPanel id="metadata" className="text-brand1-800 h-full p-5">
          {annotations.length > 0 && !props.isLoading ? (
            <projectConfig.components.MetadataPanel annotations={annotations} />
          ) : (
            <div>
              <Skeleton width="25rem" className="skeleton"></Skeleton>
              <Skeleton width="12.5rem" className="skeleton"></Skeleton>
              <Skeleton width="6.25rem" className="skeleton"></Skeleton>
            </div>
          )}
        </TabPanel>
        <TabPanel id="webannos" className="text-brand1-800 p-5">
          <>
            <ButtonsStyled>
              <AnnotationFilter />
            </ButtonsStyled>
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
          </>
        </TabPanel>
      </Tabs>
    </div>
  );
}
