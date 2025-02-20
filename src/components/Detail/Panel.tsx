import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { Mirador } from "../Mirador/Mirador";
import { TextComponent } from "../Text/TextComponent";
import { useInitDetail } from "./useInitDetail";

export const Panel = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { isLoadingDetail } = useInitDetail();
  return (
    <Tabs className="border-brand1Grey-100 flex h-[calc(100vh-100px)] w-7/12 flex-col overflow-auto border-x">
      <TabList className="border-brand1Grey-100 sticky top-0 flex w-full border-b bg-white text-sm text-neutral-600">
        <Tab
          id="facsimile"
          className="aria-selected:bg-brand1Grey-100 hover:bg-brand1Grey-50 px-4 py-2 outline-none transition-colors duration-200 hover:cursor-pointer"
        >
          Facsimile
        </Tab>
        <Tab
          id="text"
          className="aria-selected:bg-brand1Grey-100 hover:bg-brand1Grey-50 px-4 py-2 outline-none transition-colors duration-200 hover:cursor-pointer"
        >
          Text
        </Tab>
      </TabList>
      <TabPanel id="facsimile">
        <Mirador />
      </TabPanel>
      <TabPanel id="text">
        <TextComponent
          panelsToRender={projectConfig.defaultTextPanels}
          allPossiblePanels={projectConfig.allPossibleTextPanels}
          isLoading={isLoadingDetail}
        />
      </TabPanel>
    </Tabs>
  );
};
