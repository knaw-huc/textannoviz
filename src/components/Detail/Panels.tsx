import { MiradorTab } from "./MiradorTab";
import { Panel } from "./Panel";
import { TextComponentTab } from "./TextComponentTab";

export const Panels = () => {
  const panels = [
    {
      name: "facs-text",
      tabs: [
        {
          title: "Facsimile",
          content: <MiradorTab />,
        },
        {
          title: "Text",
          content: <TextComponentTab />,
        },
      ],
    },
    {
      name: "text",
      tabs: [
        {
          title: "Text",
          content: <TextComponentTab />,
        },
      ],
    },
  ];
  return (
    <>
      {panels.map((panel, index) => (
        <Panel key={index} tabsToRender={panel.tabs} name={panel.name} />
      ))}
    </>
  );
};
