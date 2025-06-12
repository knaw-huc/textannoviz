import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { useAnnotationStore } from "../../stores/annotation";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
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
  const { annotations } = useAnnotationStore();
  const { activeSidebarTab, setActiveSidebarTab } = useDetailViewStore();
  const projectConfig = useProjectStore(projectConfigSelector);
  const translate = useProjectStore(translateSelector);

  const tabStyling =
    "flex cursor-pointer items-end border-b-4 border-neutral-50 p-2 text-left text-xs font-normal text-neutral-600 outline-none hover:border-neutral-600 aria-selected:border-neutral-600 aria-selected:font-bold";

  const tabPanelStyling = "flex flex-col gap-6 overflow-auto px-6 pt-6";

  return (
    <div className="relative flex h-full justify-self-stretch overflow-hidden border-l border-neutral-400 2xl:border-r">
      <Tabs
        selectedKey={activeSidebarTab}
        onSelectionChange={(key) => setActiveSidebarTab(key)}
        className="sticky top-0 flex w-full flex-col gap-4"
      >
        <TabList
          aria-label="annotation-panel"
          className="flex w-full gap-4 border-b border-neutral-600 bg-neutral-100 px-6 pt-6"
        >
          <Tab id="metadata" className={tabStyling}>
            {translate("METADATA")}
          </Tab>
          {projectConfig.showNotesTab && (
            <Tab id="notes" className={tabStyling}>
              Notes
            </Tab>
          )}
          {projectConfig.showWebAnnoTab && (
            <Tab id="webannos" className={tabStyling}>
              {translate("WEB_ANNOTATIONS")}
            </Tab>
          )}
        </TabList>
        <TabPanel id="metadata" className={tabPanelStyling}>
          {annotations.length > 0 && !props.isLoading ? (
            <projectConfig.components.MetadataPanel annotations={annotations} />
          ) : null}
        </TabPanel>
        {projectConfig.showWebAnnoTab && (
          <TabPanel id="webannos" className={tabPanelStyling}>
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
        {projectConfig.showNotesTab && (
          <TabPanel id="notes" className={tabPanelStyling}>
            {annotations.length > 0 && !props.isLoading ? (
              <projectConfig.components.NotesPanel />
            ) : null}
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
}
