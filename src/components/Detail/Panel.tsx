import React from "react";
import {
  Button,
  Collection,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "react-aria-components";

type PanelProps = {
  tabsToRender: {
    title: string;
    content: JSX.Element;
  }[];
  panelName: string;
};

export const Panel = (props: PanelProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const tabStyling =
    "aria-selected:bg-brand1Grey-100 hover:bg-brand1Grey-50 px-4 py-2 outline-none transition-colors duration-200 hover:cursor-pointer";

  return (
    <>
      <Tabs
        className={`border-brand1Grey-100 flex h-[calc(100vh-100px)] w-7/12 flex-col overflow-auto border-x ${
          !isOpen ? "w-8" : ""
        }`}
      >
        <div className="flex flex-row">
          <Button
            className="px-2 text-sm outline-none"
            onPress={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close" : "Open"}
          </Button>

          <TabList className="border-brand1Grey-100 sticky top-0 flex w-full border-b bg-white text-sm text-neutral-600">
            {props.tabsToRender.map((item) => (
              <Tab
                key={item.title}
                id={`${props.panelName}-${item.title.toLowerCase()}`}
                className={tabStyling}
              >
                {item.title}
              </Tab>
            ))}
          </TabList>
        </div>

        {isOpen ? (
          <Collection items={props.tabsToRender}>
            {(item) => (
              <TabPanel id={`${props.panelName}-${item.title.toLowerCase()}`}>
                {item.content}
              </TabPanel>
            )}
          </Collection>
        ) : null}
      </Tabs>
    </>
  );
};
