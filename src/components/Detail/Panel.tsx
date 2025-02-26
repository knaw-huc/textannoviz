import {
  Collection,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "react-aria-components";

type PanelProps = {
  tabsToRender: {
    id: number;
    title: string;
    content: JSX.Element;
  }[];
};

export const Panel = (props: PanelProps) => {
  const tabStyling =
    "aria-selected:bg-brand1Grey-100 hover:bg-brand1Grey-50 px-4 py-2 outline-none transition-colors duration-200 hover:cursor-pointer";

  return (
    <Tabs className="border-brand1Grey-100 flex h-[calc(100vh-100px)] w-7/12 flex-col overflow-auto border-x">
      <TabList
        className="border-brand1Grey-100 sticky top-0 flex w-full border-b bg-white text-sm text-neutral-600"
        items={props.tabsToRender}
      >
        {(item) => <Tab className={tabStyling}>{item.title}</Tab>}
      </TabList>
      <Collection items={props.tabsToRender}>
        {(item) => <TabPanel>{item.content}</TabPanel>}
      </Collection>
    </Tabs>
  );
};
