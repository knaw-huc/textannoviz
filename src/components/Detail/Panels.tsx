import { MiradorTab } from "./MiradorTab";
import { Panel } from "./Panel";
import { TextComponentTab } from "./TextComponentTab";

export const Panels = () => {
  const panels = [
    {
      name: "facs-text",
      tabs: [
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
      ],
    },
    {
      name: "text",
      tabs: [
        {
          id: 3,
          title: "Text",
          content: <TextComponentTab />,
        },
      ],
    },
  ];
  return (
    <>
      {panels.map((panel, index) => (
        <Panel key={index} tabsToRender={panel.tabs} />
      ))}
    </>
  );
};
