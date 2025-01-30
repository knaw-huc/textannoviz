import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project";
import { AnnotationFilter } from "./AnnotationFilter";
import { AnnotationItem } from "./AnnotationItem";

type AnnotationProps = {
  isLoading: boolean;
};

export function Annotation(props: AnnotationProps) {
  const annotations = useAnnotationStore((state) => state.annotations);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translate = useProjectStore(translateSelector);

  return (
    <div className="border-brand1Grey-100 relative hidden w-3/12 grow self-stretch border-x md:block">
      <Tabs className="flex h-[calc(100vh-100px)] flex-col overflow-auto">
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
          {projectConfig.showWebAnnoTab && (
            <Tab
              id="webannos"
              className="aria-selected:bg-brand1Grey-100 hover:bg-brand1Grey-50 px-4 py-2 outline-none transition-colors duration-200 hover:cursor-pointer"
            >
              {translate("WEB_ANNOTATIONS")}
            </Tab>
          )}
        </TabList>
        <TabPanel id="metadata" className="text-brand1-800 h-full p-5">
          {annotations.length > 0 && !props.isLoading ? (
            <projectConfig.components.MetadataPanel annotations={annotations} />
          ) : null}
        </TabPanel>
        {projectConfig.showWebAnnoTab && (
          <TabPanel id="webannos" className="text-brand1-800 p-5">
            <>
              <div className="flex">
                <AnnotationFilter />
              </div>
              {annotations?.length > 0 &&
                !props.isLoading &&
                annotations.map((annotation, index) => (
                  <AnnotationItem key={index} annotation={annotation} />
                ))}
              {annotations?.length === 0 && !props.isLoading && (
                <div className="font-bold">No web annotations</div>
              )}
            </>
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
}
