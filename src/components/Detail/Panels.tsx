import { MiradorTab } from "./MiradorTab";
import { Panel } from "./Panel";
import { TextComponentTab } from "./TextComponentTab";

export const Panels = () => {
  const tabs = [
    {
      id: 1,
      title: "Facsimile",
      content: <MiradorTab />,
    },
    {
      id: 2,
      title: "Text",
      content: <TextComponentTab />,
    },
  ];
  return (
    <>
      <Panel tabsToRender={tabs} />
    </>
  );
};
