import { Panel } from "./Panel";
import { usePanelLayout } from "./usePanelLayout.tsx";

export const Panels = () => {
  const panels = usePanelLayout();

  return (
    <>
      {panels.map((panel) => (
        <Panel
          key={panel.name}
          panelToRender={panel.panel}
          panelName={panel.name}
        />
      ))}
    </>
  );
};
