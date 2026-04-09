import { Panel } from "./Panel";
import { usePanelLayout } from "./usePanelLayout.tsx";

export const Panels = () => {
  const panelLayout = usePanelLayout();

  return (
    <>
      {panelLayout.map((panel) => (
        <Panel
          key={panel.name}
          panelToRender={panel.panel}
          panelName={panel.name}
        />
      ))}
    </>
  );
};
